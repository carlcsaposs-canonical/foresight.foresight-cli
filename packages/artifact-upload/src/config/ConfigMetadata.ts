import ConfigNames from './ConfigNames';

export default {
    [ConfigNames.THUNDRA_APIKEY]: {
        flag: '--apiKey <string>',
        description: 'Thundra API Key'
    },
    [ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID]: {
        flag: '--testProjectId <string>',
        description: 'Thundra Foresight Test Project Id'
    },
    [ConfigNames.THUNDRA_UPLOADER_REPORT_DIR]: {
        flag: '-ud, --uploadDir <string>',
        description: 'Thundra Uploader Report Directory',
    },
    [ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL]: {
        flag: '--logLevel <string>',
        description: 'Thundra Uploader Log Level',
        default: 'ERROR'
    },
    [ConfigNames.THUNDRA_ARTIFACT_UPLOADER_URL]: {
        flag: '--artifactUploaderUrl <string>',
        description: 'Thundra Artifact Uploader Url',
        default: 'https://'
    },
    [ConfigNames.THUNDRA_UPLOADER_SIZE_MAX]: {
        flag: '--artifactUploaderUrl <string>',
        description: 'Thundra Artifact Uploader Url',
        default: 100 * 1024
    },
    [ConfigNames.THUNDRA_TMP]: {
        flag: '--tmp []',
        description: 'tmp',
        default: {}
    }
};