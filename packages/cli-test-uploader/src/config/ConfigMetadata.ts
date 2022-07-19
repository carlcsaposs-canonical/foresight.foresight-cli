import { ConfigNames, TestUploaderConfig, CoverageUploaderConfig, UploaderConfig } from './ConfigNames';
import { ConfigType } from '@thundra/foresight-cli-config-provider';

export const UploaderConfigMetadata = {
    [ConfigNames.general.apiKey]: {
        key: 'apiKey',
        required: true,
        flag: '-a, --apiKey <string>',
        description: 'Foresight API Key',
        type: 'string'
    },
    [ConfigNames.uploader.dir]: {
        key: 'uploadDir',
        required: true,
        flag: '-ud, --uploadDir <string>',
        description: 'Foresight Uploader Report Directory',
        type: 'array'
    },
    [ConfigNames.general.projectId]: {
        key: 'projectId',
        flag: '-p, --projectId <string>',
        description: 'Foresight Project Id',
        type: 'string'
    },
    [ConfigNames.general.logLevel]: {
        key: 'logLevel',
        flag: '-l, --logLevel <enum>',
        description: 'Foresight Uploader Log Level',
        type: 'string',
        default: 'info'
    },
    [ConfigNames.signer.url]: {
        key: 'signerUrl',
        flag: '-su, --signerUrl <string>',
        description: 'Foresight Uploader Signer Url',
        type: 'string',
        default: 'https://upload.thundra.io'
    },
    [ConfigNames.archiver.scanPathMaxDepth]: {
        key: 'archiveScanPathMaxDepth',
        flag: '-apsmd, --archiveScanPathMaxDepth <number>',
        description: 'Foresight Uploader Max Scan Depth',
        type: 'number',
        default: 5,
    },
    [ConfigNames.archiver.processTimeout]: {
        key: 'archiveProcessTimeout',
        flag: '-aptout, --archiveProcessTimeout <number>',
        description: 'Foresight Archive Process Time out in miliseconds',
        type: 'number',
        default: 30000,
    },
    [ConfigNames.uploader.maxSize]: {
        key: 'uploaderMaxSize',
        flag: '-upms, --uploaderMaxSize <number>',
        description: 'Foresight Uploader Max Report Artifact Size',
        type: 'number',
        default: 20 // MB,
    },
    [ConfigNames.uploader.processTimeout]: {
        key: 'uploadProcessTimeout',
        flag: '-uptout, --uploadProcessTimeout <number>',
        description: 'Foresight Upload Process Time out in miliseconds',
        type: 'number',
        default: 30000,
    },
    [ConfigNames.uploader.trackProgress]: {
        key: 'uploadTrackProgress',
        flag: '-uptp, --uploadTrackProgress <boolean>',
        description: 'Foresight Upload Process Track Progress',
        type: 'boolean',
        default: true,
    }
} as UploaderConfig;

export type TestUploaderMetaData = ConfigType.BaseConfigMetaData<TestUploaderConfig | {}> ;

export const TestUploaderConfigMetadata = {
    ...UploaderConfigMetadata,
    [ConfigNames.command.test.framework]: {
        key: 'framework',
        required: true,
        flag: '-fw, --framework <enum>',
        description: `Foresight Uploader Test Framework Type`,
        type: 'string'
    },
    [ConfigNames.command.test.format]: {
        key: 'format',
        required: false,
        flag: '-fm, --format <enum>',
        description: `Foresight Uploader Test Format Type`,
        type: 'string'
    },
} as TestUploaderMetaData;

export type CoverageUploaderMetaData = ConfigType.BaseConfigMetaData<CoverageUploaderConfig | {}> ;

export const CoveragetUploaderConfigMetadata = {
    ...UploaderConfigMetadata,
    [ConfigNames.command.coverage.format]: {
        key: 'format',
        required: true,
        flag: '-fw, --format <enum>',
        description: `Foresight Uploader Coverage Format Type`,
        type: 'string'
    },
} as CoverageUploaderMetaData;