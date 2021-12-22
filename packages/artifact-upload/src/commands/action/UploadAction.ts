/* eslint-disable */

import UploadActionModel from '../../model/UploadActionModel';
import * as FileUtil from '../../utils/File';
import * as ArchiveUtil from '../../utils/Archive';
import * as path from 'path';
import ConfigProvider from '../../config/ConfigProvider';
import { UPLOADER_TMP_PREFIX } from '../../constats';
import * as EnvironmentSupport from '../../environment/EnvironmentSupport';
import * as Utils from '../../utils/Utils';
import * as Metadata from '../../metadata';
import ConfigNames from '../../config/ConfigNames';

import { makeRequest } from '../../utils/Http';

import * as fs from 'fs';
import * as util from 'util';

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

    const filename = Utils.generateRandomFileName('.zip');
    /**
     * optain file key for signed url
     * 
     * const testProjectId = ConfigProvider.get<number>(ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID);
     * const fileKey = `${testProjectId}-filename`;
     */

    const metaData = Metadata.createMetaData();

    const sourceDir = Utils.getAbsolutePath(options.uploadDir);
    const destinationDir = FileUtil.createFolderUnderTmpSync(UPLOADER_TMP_PREFIX);

    const result = await ArchiveUtil.zipFolder(
        sourceDir,
        path.join(destinationDir, filename), // `${Utils.generateShortId()}.zip`
        JSON.stringify(metaData));

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
