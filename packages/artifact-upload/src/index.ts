#!/usr/bin/env node

import { Command, Option } from 'commander';
import { action, preAction } from './commands/action/UploadAction';
import ConfigNames from './config/ConfigNames';
import ConfigMetadata from './config/ConfigMetadata';

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
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_REPORT_DIR].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_REPORT_DIR].description)
                .env(ConfigNames.THUNDRA_UPLOADER_REPORT_DIR)
                .makeOptionMandatory())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_ARTIFACT_UPLOADER_URL].flag,
                ConfigMetadata[ConfigNames.THUNDRA_ARTIFACT_UPLOADER_URL].description)
                .default(ConfigMetadata[ConfigNames.THUNDRA_ARTIFACT_UPLOADER_URL].default)
                .env(ConfigNames.THUNDRA_ARTIFACT_UPLOADER_URL)
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL].description)
                .default(ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL].default)
                .env(ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL)
                .hideHelp())
        .addOption(
            new Option(
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIZE_MAX].flag,
                ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIZE_MAX].description)
                .default(ConfigMetadata[ConfigNames.THUNDRA_UPLOADER_SIZE_MAX].default)
                .env(ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL)
                .hideHelp())
        .description('Uploader')
        .hook('preAction', preAction)
        .action(action);
  
    await program.parseAsync(process.argv);
})().catch(err => {
    // handle all errors
    console.error(err);
});

