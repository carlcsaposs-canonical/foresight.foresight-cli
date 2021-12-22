/* eslint-disable */

import UploadActionModel from '../../model/UploadActionModel';
import { createFolderUnderTmpSync, removeFolderSync } from '../../utils/File';
import { zipFolder } from '../../utils/Archive';
import * as path from 'path';
import ConfigProvider from '../../config/ConfigProvider';
import { UPLOADER_TMP_PREFIX } from '../../constats';
import * as EnvironmentSupport from '../../environment/EnvironmentSupport';

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
     * Options Usage
     * 
     * options.uploadDir
     * const size = ConfigProvider.get<number>(ConfigNames.THUNDRA_UPLOADER_SIZE_MAX);
     */

    /**
     * validate required args || options
     * validate path options is exists
     */

    const metaData = EnvironmentSupport.getEnvironmentInfo();
    console.log(EnvironmentSupport.getEnvironmentInfo());

    const sourceDir = path.join(__dirname, '../../../tmp')
    const destinationDir = createFolderUnderTmpSync(UPLOADER_TMP_PREFIX);

    const result = await zipFolder(sourceDir, path.join(destinationDir, '/tmp.zip'), JSON.stringify(metaData));
    console.log(result);

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