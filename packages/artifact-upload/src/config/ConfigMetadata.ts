import ConfigNames from './ConfigNames';

export default {
    [ConfigNames.THUNDRA_APIKEY]: {
        key: 'apiKey',
        flag: '--apiKey <string>',
        description: 'Thundra API Key'
    },
    [ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID]: {
        key: 'testProjectId',
        flag: '--testProjectId <string>',
        description: 'Thundra Foresight Test Project Id'
    },
    [ConfigNames.THUNDRA_UPLOADER_TYPE]: {
        key: 'testProjectId',
        flag: '-t, --type <enum>',
        description: 'Thundra Uploader Type Values <TEST>'
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
    [ConfigNames.THUNDRA_ARTIFACT_UPLOADER_URL]: {
        key: 'artifactUploaderUrl',
        flag: '--artifactUploaderUrl <string>',
        description: 'Thundra Artifact Uploader Url',
        default: 'https://'
    },
    [ConfigNames.THUNDRA_UPLOADER_SIZE_MAX]: {
        key: 'uploaderMaxSize',
        flag: '--uploaderMaxSize <string>',
        description: 'Thundra Artifact Uploader Url',
        default: 100 * 1024
    },
    [ConfigNames.THUNDRA_TMP]: {
        key: 'tmp',
        flag: '--tmp []',
        description: 'tmp',
        default: {}
    }
};