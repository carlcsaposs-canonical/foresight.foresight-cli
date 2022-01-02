#!/usr/bin/env node

import { Command, Option } from 'commander';
import { action, preAction } from './commands/action/UploadAction';
import ConfigNames from './config/ConfigNames';
import ConfigMetadata from './config/ConfigMetadata';
import { FILE_TYPES, FRAMEWORK_TYPES } from './constats';
import * as FileUtils from './utils/File';
import * as Utils from './utils/Utils';

const program = new Command();
program.version('0.0.1');

(async() => {
    program
        .command('upload')
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_APIKEY].flag,
                ConfigMetadata[ConfigNames.THUNDRA_APIKEY].description)
                .env(ConfigNames.THUNDRA_APIKEY)
                .makeOptionMandatory()
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID].flag,
                ConfigMetadata[ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID].description)
                .env(ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID)
                .makeOptionMandatory()
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_TYPE].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_TYPE].description)
                .choices(Object.values(FILE_TYPES))
                .env(ConfigNames.THUNDRA_UPLOADER_TYPE)
                .makeOptionMandatory())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_REPORT_DIR].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_REPORT_DIR].description)
                .env(ConfigNames.THUNDRA_UPLOADER_REPORT_DIR)
                .makeOptionMandatory()
                .argParser<string>((value: string): string => {
                    if (!FileUtils.isExist(Utils.getAbsolutePath(value))) {
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
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIGNER_URL].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIGNER_URL].description)
                .env(ConfigNames.THUNDRA_UPLOADER_SIGNER_URL)
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL].description)
                .env(ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL)
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIZE_MAX].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIZE_MAX].description)
                .env(ConfigNames.THUNDRA_UPLOADER_SIZE_MAX)
                .hideHelp())
        .description('Uploader')
        .hook('preAction', preAction)
        .action(action);
  
    await program.parseAsync(process.argv);
})().catch(err => {
    // handle all errors
    console.error(err);
});

