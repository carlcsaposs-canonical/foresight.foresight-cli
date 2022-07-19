import { Command, Option } from 'commander';
import { ConfigNames } from '../../config/ConfigNames';
import { 
    UploaderConfigMetadata,
    TestUploaderConfigMetadata,
    CoveragetUploaderConfigMetadata,
} from '../../config/ConfigMetadata';
import { 
    TEST_FRAMEWORK_TYPES, 
    TEST_FORMAT_TYPES,
    COVERAGE_FORMAT_TYPES,
} from '../../constants';
import * as TestUpload from './action/test';
import * as CoverageUpload from './action/cov';

const createUploaderCommand = (commandName: string): Command => {
    return new Command(commandName)
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.general.apiKey].flag,
                UploaderConfigMetadata[ConfigNames.general.apiKey].description)
                .env(ConfigNames.general.apiKey)
                .makeOptionMandatory()
                .hideHelp())
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.general.projectId].flag,
                UploaderConfigMetadata[ConfigNames.general.projectId].description)
                .env(ConfigNames.general.projectId)
                .hideHelp())
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.uploader.dir].flag,
                UploaderConfigMetadata[ConfigNames.uploader.dir].description)
                .env(ConfigNames.uploader.dir)
                .default([])
                .makeOptionMandatory()
                .argParser<string[]>((value, previous): string[] => {
                    return previous.concat([value]);
                }))
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.general.logLevel].flag,
                UploaderConfigMetadata[ConfigNames.general.logLevel].description)
                .env(ConfigNames.general.logLevel)
                .hideHelp())
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.signer.url].flag,
                UploaderConfigMetadata[ConfigNames.signer.url].description)
                .env(ConfigNames.signer.url)
                .hideHelp())
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.archiver.scanPathMaxDepth].flag,
                UploaderConfigMetadata[ConfigNames.archiver.scanPathMaxDepth].description)
                .env(ConfigNames.archiver.scanPathMaxDepth)
                .hideHelp())
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.archiver.processTimeout].flag,
                UploaderConfigMetadata[ConfigNames.archiver.processTimeout].description)
                .env(ConfigNames.archiver.processTimeout)
                .hideHelp())
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.uploader.maxSize].flag,
                UploaderConfigMetadata[ConfigNames.uploader.maxSize].description)
                .env(ConfigNames.uploader.maxSize)
                .hideHelp())
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.uploader.processTimeout].flag,
                UploaderConfigMetadata[ConfigNames.uploader.processTimeout].description)
                .env(ConfigNames.uploader.processTimeout)
                .hideHelp())
        .addOption(
            new Option(
                UploaderConfigMetadata[ConfigNames.uploader.trackProgress].flag,
                UploaderConfigMetadata[ConfigNames.uploader.trackProgress].description)
                .env(ConfigNames.uploader.trackProgress)
                .hideHelp())
}

export const createTestUploadCommand = () => {
    return createUploaderCommand('upload-test')
        .addOption(
            new Option(
                TestUploaderConfigMetadata[ConfigNames.command.test.framework].flag,
                TestUploaderConfigMetadata[ConfigNames.command.test.framework].description)
                .choices(Object.values(TEST_FRAMEWORK_TYPES))
                .env(ConfigNames.command.test.framework)
                .makeOptionMandatory())
        .addOption(
            new Option(
                TestUploaderConfigMetadata[ConfigNames.command.test.format].flag,
                TestUploaderConfigMetadata[ConfigNames.command.test.format].description)
                .choices(Object.values(TEST_FORMAT_TYPES))
                .env(ConfigNames.command.test.format))
        .description('Upload test reports to Foresight.')
        .hook('preAction', TestUpload.preAction)
        .action(TestUpload.action);
}

export const createCoverageUploadCommand = () => {
    return createUploaderCommand('upload-test-coverage')
        .addOption(
            new Option(
                CoveragetUploaderConfigMetadata[ConfigNames.command.coverage.format].flag,
                CoveragetUploaderConfigMetadata[ConfigNames.command.coverage.format].description)
                .choices(Object.values(COVERAGE_FORMAT_TYPES))
                .env(ConfigNames.command.coverage.format)
                .makeOptionMandatory())
        .description('Upload test coverage reports to Foresight.')
        .hook('preAction', CoverageUpload.preAction)
        .action(CoverageUpload.action);
}