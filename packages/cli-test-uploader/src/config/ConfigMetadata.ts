import ConfigNames from './ConfigNames';

interface ConfigMeta {
    [key: string]: {
        key: string,
        flag: string,
        description: string,
        type?: string,
        default?: any,
    };
}

const config: ConfigMeta = {
    [ConfigNames.THUNDRA_APIKEY]: {
        key: 'apiKey',
        flag: '-a, --apiKey <string>',
        description: 'Thundra API Key',
        type: 'string'
    },
    [ConfigNames.THUNDRA_FORESIGHT_PROJECT_ID]: {
        key: 'projectId',
        flag: '-p, --projectId <string>',
        description: 'Thundra Foresight Project Id'
    },
    [ConfigNames.THUNDRA_UPLOADER_FRAMEWORK]: {
        key: 'framework',
        flag: '-f, --framework <enum>',
        description: `Thundra Uploader Framework Type`
    },
    [ConfigNames.THUNDRA_UPLOADER_REPORT_DIR]: {
        key: 'uploadDir',
        flag: '-ud, --uploadDir <string>',
        description: 'Thundra Uploader Report Directory',
    },
    [ConfigNames.THUNDRA_FORESIGHT_LOG_LEVEL]: {
        key: 'logLevel',
        flag: '-l, --logLevel <string>',
        description: 'Thundra Uploader Log Level',
        default: 'ERROR'
    },
    [ConfigNames.THUNDRA_UPLOADER_SIGNER_URL]: {
        key: 'uploaderSignerUrl',
        flag: '-su, --uploaderSignerUrl <string>',
        description: 'Thundra Uploader Signer Url',
        default: 'https://upload.thundra.io'
    },
    [ConfigNames.THUNDRA_UPLOADER_SIZE_MAX]: {
        key: 'uploaderMaxSize',
        flag: '-ms, --uploaderMaxSize <string>',
        description: 'Thundra Uploader Max Report Artifact Size',
        default: 20 // MB
    }
};

export default config;