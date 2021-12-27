/* eslint-disable */

import * as fs from 'fs';
import * as util from 'util';
import UploadActionModel from '../../model/UploadActionOption';
import * as Utils from '../../utils/Utils';
import * as FileUtil from '../../utils/File';
import * as ArchiveUtil from '../../utils/Archive';
import * as HttpUtil from '../../utils/Http';
import * as path from 'path';
import ConfigProvider from '../../config/ConfigProvider';
import * as EnvironmentSupport from '../../environment/EnvironmentSupport';
import * as MetadataCreater from '../../metadata';
import Metadata from '../../model/Metadata';
import ConfigNames from '../../config/ConfigNames';
import { UPLOADER_TMP_PREFIX } from '../../constats';

const readFile = util.promisify(fs.readFile);

export const preAction = async (command: any) => {
    if (!command) {
        // log && throw error
        return;
    }
    
    ConfigProvider.init(command.opts());
    await EnvironmentSupport.init();

    /**
     * init config from options
     * init environment provider
     */
};

export const action = async (options: UploadActionModel) => {

    /**
     * validate required args || options
     */

    /**
     * generate unique file name
     * (runId + time) as uuid ?
     */
    const filename = Utils.generateRandomFileName('.zip');
    const signerUrl = ConfigProvider.get<string>(ConfigNames.THUNDRA_UPLOADER_SIGNER_URL);
    const testProjectId = ConfigProvider.get<number>(ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID);
    const type = ConfigProvider.get<string>(ConfigNames.THUNDRA_UPLOADER_TYPE);
    const fileKey = `${testProjectId}/${filename}`; // '/' for foldering on s3

    const metaData: Metadata = MetadataCreater.createMetaData();

    const sourceDir = Utils.getAbsolutePath(options.uploadDir);
    const destinationDir = FileUtil.createFolderUnderTmpSync(UPLOADER_TMP_PREFIX);

    const archivedFileDir = await ArchiveUtil.zipFolder(
        sourceDir,
        path.join(destinationDir, filename),
        JSON.stringify(metaData)
    );

    if (!archivedFileDir) {
        // log
        return;
    }

    const mineType = FileUtil.getMineType(archivedFileDir);

    const presignedS3Url = await HttpUtil.request({
        url: signerUrl,
        method: 'POST',
        data: {
            type,
            key: fileKey,
            contentType: mineType
        },
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        }
    });

    if (!presignedS3Url) {
        // log
        return;
    }

    const uploadUrl = JSON.parse(presignedS3Url).url;

    const file = await readFile(archivedFileDir);

    const uploadResult = await HttpUtil.request({
        url: uploadUrl,
        method: 'PUT',
        data: file,
        headers: {
            'Content-Type': mineType,
            'Content-Length': file.length
        }
    });

    FileUtil.removeFolderSync(destinationDir);

    /**
     * take SINGED_URL_HERE make request to THUNDRA_ARTIFACT_UPLOADER_URL
     * const file = await readFile(result.destinationDir);
     * const uploadResult = await makeRequest(
     *     'SINGED_URL_HERE',
     *     file, 
     *     {
     *         method: 'PUT',
     *         headers: {  
     *             'Content-Type': 'application/zip',
     *             'Content-Length': file.length
     *         }
     *     }
     * );
     */

    /**
     * create tmp dir
     * zip path option dir
     * create metadata for file
     * take signed url
     * upload zip file from tmp dir
     * remove temp file removeFolderSync(destinationDir);
     */
    
    return console.log(JSON.stringify({
        field: 'value'
    }));
};
