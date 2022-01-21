import { Command, Option } from 'commander';
import { action, preAction } from './action/UploadAction';
import ConfigNames from '../../config/ConfigNames';
import ConfigMetadata from '../../config/ConfigMetadata';
import { FRAMEWORK_TYPES } from '../../constants';
import {
    FileUtil,
    Utils,
} from '@thundra/foresight-cli-utils';

export const createTestUploadCommand = () => {
    return new Command('upload-test')
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_APIKEY].flag,
                ConfigMetadata[ConfigNames.THUNDRA_APIKEY].description)
                .env(ConfigNames.THUNDRA_APIKEY)
                .makeOptionMandatory()
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_FORESIGHT_PROJECT_ID].flag,
                ConfigMetadata[ConfigNames.THUNDRA_FORESIGHT_PROJECT_ID].description)
                .env(ConfigNames.THUNDRA_FORESIGHT_PROJECT_ID)
                .makeOptionMandatory()
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_REPORT_DIR].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_REPORT_DIR].description)
                .env(ConfigNames.THUNDRA_UPLOADER_REPORT_DIR)
                .makeOptionMandatory()
                .argParser<string>((value: string): string => {
                    if (!FileUtil.isExist(Utils.getAbsolutePath(value))) {
                        throw new Error(`${value} is not valid directory.`);
                    }

                    return value;
                }))
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_FRAMEWORK].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_FRAMEWORK].description)
                .choices(Object.values(FRAMEWORK_TYPES))
                .env(ConfigNames.THUNDRA_UPLOADER_FRAMEWORK)
                .makeOptionMandatory())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_FORESIGHT_LOG_LEVEL].flag,
                ConfigMetadata[ConfigNames.THUNDRA_FORESIGHT_LOG_LEVEL].description)
                .env(ConfigNames.THUNDRA_FORESIGHT_LOG_LEVEL)
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIGNER_URL].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIGNER_URL].description)
                .env(ConfigNames.THUNDRA_UPLOADER_SIGNER_URL)
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIZE_MAX].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIZE_MAX].description)
                .env(ConfigNames.THUNDRA_UPLOADER_SIZE_MAX)
                .hideHelp())
        .description('Upload test reports to Thundra Foresight.')
        .hook('preAction', preAction)
        .action(action);
}