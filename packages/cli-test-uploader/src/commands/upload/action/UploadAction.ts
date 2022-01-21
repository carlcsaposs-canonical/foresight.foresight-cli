/* eslint-disable */

import {
    Utils,
    FileUtil,
    ArchiveUtil,
    HttpUtil,
} from '@thundra/foresight-cli-utils';
import * as path from 'path';
import { ConfigProvider } from '@thundra/foresight-cli-config-provider';
import * as MetadataProvider from '../../../metadata';
import Metadata from '../../../model/Metadata';
import ConfigNames from '../../../config/ConfigNames';
import { 
    UPLOADER_TMP_PREFIX,
    UPLOADER_SIGNER_PATH,
    UPLOADER_SIGNED_URL_TYPE,
} from '../../../constants';
import { init } from '../../../init';
import { logger } from '@thundra/foresight-cli-logger';

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
    const projectId = ConfigProvider.get<string>(ConfigNames.THUNDRA_FORESIGHT_PROJECT_ID);
    const reportDir = ConfigProvider.get<string>(ConfigNames.THUNDRA_UPLOADER_REPORT_DIR);
    const maxFileSize = ConfigProvider.get<number>(ConfigNames.THUNDRA_UPLOADER_SIZE_MAX);
    const fileKey = `${projectId}/${filename}`; // '/' for foldering on s3

    const metaData: Metadata = MetadataProvider.createMetaData();
    const sourceDir = Utils.getAbsolutePath(reportDir);
    const destinationDir = await FileUtil.createFolderUnderTmp(UPLOADER_TMP_PREFIX);

    logger.debug(`<UploadAction> Tmp folder created under ${destinationDir}`);

    try {
        const archivedFileDir = await ArchiveUtil.zipFolder(
            sourceDir,
            path.join(destinationDir, filename),
            JSON.stringify(metaData)
        );

        if (!archivedFileDir) {
            logger.error('<UploadAction> Files did not archived');
            return;
        }

        logger.debug(`<UploadAction> Files archived to ${archivedFileDir}`);

        const archivedFileSize = await FileUtil.getFileSizeMB(archivedFileDir);
        if (archivedFileSize > maxFileSize) {
            logger.error(`<UploadAction> File size could not be greater than THUNDRA UPLOADER SIZE_MAX value: ${maxFileSize}`);
            return;
        } else if (archivedFileSize == 0) {
            logger.error(`<UploadAction> Archived file size is zero: ${archivedFileDir}`);
            return;
        }

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
            logger.error('<UploadAction> Signed url did not created');
            return;
        }

        logger.debug('<UploadAction> Signed url created successfully');

        const uploadUrl = JSON.parse(presignedS3Url).url;
        const file = await FileUtil.getFile(archivedFileDir);

        if (!file) {
            logger.error(`<UploadAction> Could not retrive archivedFileDir: ${archivedFileDir}`);
            return; 
        }

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
        const removeResult = await FileUtil.removeFolder(destinationDir);
        if (removeResult) {
            logger.debug(`<UploadAction> Tmp folder: ${destinationDir} deleted`);
        }
    }
};
