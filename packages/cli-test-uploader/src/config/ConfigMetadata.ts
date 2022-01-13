import ConfigNames from './ConfigNames';
import { FRAMEWORK_TYPES } from '../constats';

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
        flag: '--apiKey <string>',
        description: 'Thundra API Key',
        type: 'string'
    },
    [ConfigNames.THUNDRA_FORESIGHT_PROJECT_ID]: {
        key: 'projectId',
        flag: '--projectId <string>',
        description: 'Thundra Foresight Project Id'
    },
    [ConfigNames.THUNDRA_UPLOADER_FRAMEWORK]: {
        key: 'framework',
        flag: '-f, --framework <enum>',
        description: `Thundra Uploader Framework Type Values <${Object.keys(FRAMEWORK_TYPES).join(' | ')}>`
    },
    [ConfigNames.THUNDRA_UPLOADER_REPORT_DIR]: {
        key: 'uploadDir',
        flag: '-ud, --uploadDir <string>',
        description: 'Thundra Uploader Report Directory',
    },
    [ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL]: {
        key: 'logLevel',
        flag: '--logLevel <string>',
        description: 'Thundra Uploader Log Level',
        default: 'ERROR'
    },
    [ConfigNames.THUNDRA_UPLOADER_SIGNER_URL]: {
        key: 'uploaderSignerUrl',
        flag: '--uploaderSignerUrl <string>',
        description: 'Thundra Uploader Signer Url',
        default: 'https://upload.thundra.io'
    },
    [ConfigNames.THUNDRA_UPLOADER_SIZE_MAX]: {
        key: 'uploaderMaxSize',
        flag: '--uploaderMaxSize <string>',
        description: 'Thundra Artifact Uploader Url',
        default: 100 * 1024
    }
};

export default config;