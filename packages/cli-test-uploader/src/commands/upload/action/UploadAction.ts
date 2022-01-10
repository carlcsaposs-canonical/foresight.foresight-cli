/* eslint-disable */

import * as fs from 'fs';
import * as util from 'util';
import {
    Utils,
    FileUtil,
    ArchiveUtil,
    HttpUtil,
} from '@thundra-foresight/cli-utils';
import * as path from 'path';
import { ConfigProvider } from '@thundra-foresight/cli-config-provider';
import * as MetadataProvider from '../../../metadata';
import Metadata from '../../../model/Metadata';
import ConfigNames from '../../../config/ConfigNames';
import { 
    UPLOADER_TMP_PREFIX,
    UPLOADER_SIGNER_PATH,
    UPLOADER_SIGNED_URL_TYPE,
} from '../../../constats';
import { init } from '../../../init';
import { logger } from '@thundra-foresight/cli-logger';

const readFile = util.promisify(fs.readFile);

export const preAction = async (command: any) => {
    if (!command) {
        logger.error('<PreAction> Command can not be null');
        return;
    }
    
    await init(command.opts());
};

export const action = async () => {
    /**
     * generate unique file name
     * (runId + time) as uuid ?
     */

    logger.debug('<UploadAction> Upload action working ...');

    const filename = Utils.generateRandomFileName('.zip');
    const signerUrl = ConfigProvider.get<string>(ConfigNames.THUNDRA_UPLOADER_SIGNER_URL);
    const apiKey = ConfigProvider.get<string>(ConfigNames.THUNDRA_APIKEY);
    const testProjectId = ConfigProvider.get<string>(ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID);
    const reportDir = ConfigProvider.get<string>(ConfigNames.THUNDRA_UPLOADER_REPORT_DIR);
    const fileKey = `${testProjectId}/${filename}`; // '/' for foldering on s3

    const metaData: Metadata = MetadataProvider.createMetaData();
    const sourceDir = Utils.getAbsolutePath(reportDir);
    const destinationDir = FileUtil.createFolderUnderTmpSync(UPLOADER_TMP_PREFIX);

    logger.debug(`<UploadAction> Tmp folder created under ${destinationDir}`);

    try {
        const archivedFileDir = await ArchiveUtil.zipFolder(
            sourceDir,
            path.join(destinationDir, filename),
            JSON.stringify(metaData)
        );

        if (!archivedFileDir) {
            logger.debug('<UploadAction> Files did not archived');
            return;
        }

        logger.debug(`<UploadAction> Files archived to ${archivedFileDir}`);

        const mimeType = FileUtil.getMimeType(archivedFileDir);
        const presignedS3Url = await HttpUtil.request({
            url: Utils.getJoinedUrl(signerUrl, UPLOADER_SIGNER_PATH),
            method: 'POST',
            data: {
                type: UPLOADER_SIGNED_URL_TYPE,
                key: fileKey,
                contentType: mimeType
            },
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                "authorization": `ApiKey ${apiKey}`
            }
        });

        if (!presignedS3Url) {
            logger.debug('<UploadAction> Signed url did not created');
            return;
        }

        logger.debug('<UploadAction> Signed url created successfully');

        const uploadUrl = JSON.parse(presignedS3Url).url;
        const file = await readFile(archivedFileDir);

        await HttpUtil.request({
            url: uploadUrl,
            method: 'PUT',
            data: file,
            headers: {
                'Content-Type': mimeType,
                'Content-Length': file.length
            }
        });

        logger.debug('<UploadAction> Files uploaded');

        return console.log(JSON.stringify({
            status: 'Ok',
            message: `Successfully uploaded all files under ${reportDir}`,
        }));
    } finally {
        FileUtil.removeFolderSync(destinationDir);
        logger.debug(`<UploadAction> Tmp folder: ${destinationDir} deleted`);
    }
};