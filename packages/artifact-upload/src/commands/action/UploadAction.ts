/* eslint-disable */

import UploadActionModel from '../model/UploadActionModel';
import { createFolderUnderTmpSync, removeFolderSync } from '../../utils/File';
import { zipFolder } from '../../utils/Archive';
import * as path from 'path';
import UploaderConfigProvider from '../../config/UploaderConfigProvider';
import ConfigNames from '../../config/ConfigNames';
import { uploaderTmpPrefix } from '../../constats';

export const preAction = (command: any) => {
    if (!command) {
        return;
    }
    
    const options = command.opts();
    console.log(options);

    UploaderConfigProvider.init(options);

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
     * const size = UploaderConfigProvider.get<number>(ConfigNames.THUNDRA_UPLOADER_SIZE_MAX);
     */

    /**
     * validate required args || options
     * validate path options is exists
     */

    const sourceDir = path.join(__dirname, '../../../tmp')
    const destinationDir = createFolderUnderTmpSync(uploaderTmpPrefix);

    const result = await zipFolder(sourceDir, path.join(destinationDir, '/tmp.zip'));
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