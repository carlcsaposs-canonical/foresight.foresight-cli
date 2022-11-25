import { ConfigType } from '@runforesight/foresight-cli-config-provider';

export const ConfigNames = {
    general: {
        apiKey: 'FORESIGHT_APIKEY',
        projectId: 'FORESIGHT_PROJECT_ID',
        logLevel: 'FORESIGHT_LOG_LEVEL',
    },
    signer: {
        url: 'FORESIGHT_UPLOADER_SIGNER_URL',
    }, 
    archiver: {
        scanPathMaxDepth: 'FORESIGHT_SCAN_PATH_MAX_DEPTH',
        processTimeout: 'FORESIGHT_ARCHIVE_PROCESS_TIMEOUT',
        forceStreamToEnd: 'FORESIGHT_ARCHIVE_FORCE_STREAM_TO_END',
    },
    uploader: {
        dir: 'FORESIGHT_UPLOADER_REPORT_DIR',
        maxSize: 'FORESIGHT_UPLOADER_SIZE_MAX',
        processTimeout: 'FORESIGHT_UPLOAD_PROCESS_TIMEOUT',
        trackProgress: 'FORESIGHT_UPLOAD_TRACK_PROGRESS' 
    },
    command: {
        general: {
            tag: 'FORESIGHT_UPLOADER_TAG'
        },
        test: {
            framework: 'FORESIGHT_UPLOADER_TEST_FRAMEWORK',
            format: 'FORESIGHT_UPLOADER_TEST_FORMAT', 
        },
        coverage: {
            format: 'FORESIGHT_UPLOADER_COVERAGE_FORMAT', 
        }
    }
};

export interface UploaderConfig extends ConfigType.BaseConfig {
    /**
     * Foresight api key.
     * You can set api key with FORESIGHT_APIKEY environment variable instead of setting `apiKey` field.
     * ``required | FORESIGHT_APIKEY environment variable``
     */
    apiKey?: string,

    /**
     * Upload dir.
     * You can set upload dir with FORESIGHT_UPLOADER_REPORT_DIR environment variable instead of setting `uploadDir` field.
     * ``required | FORESIGHT_UPLOADER_REPORT_DIR environment variable``
     */
    uploadDir?: string[],

    /**
     * CLI log level.
     * ``default ERROR``
     */
    logLevel?: string,

    /**
     * Foresight project id.
     */
    projectId?: string,

    /**
     * Uploader signer url.
     * ``default Foresight signer address``
     */
    signerUrl?: string,

    /**
     * Upload max size.
     * ``default 20 MB``
     */
    uploadMaxSize?: number,

    /**
     * Upload process timeout.
     * ``default 30000 ms``
     */
     uploadProcessTimeout?: number;

    /**
     * Upload process timeout.
     * ``default 30000 ms``
     */
    uploadTrackProgress?: boolean;

    /**
     * Scan path max depth.
     * ``default 5``
     */
     archiveScanPathMaxDepth?: number;

    /**
     * Archive process timeout.
     * ``default 30000 ms``
     */
    archiveProcessTimeout?: number;

    /**
     * Append additional tags.
     * Must be formated like ``key:value``
     * ``default null``
     */
    tag: string
}

export interface TestUploaderConfig extends UploaderConfig { 

    /**
     * Framework.
     * You can set test framework with FORESIGHT_UPLOADER_TEST_FRAMEWORK environment variable 
     * instead of setting `framework` field.
     * ``required | FORESIGHT_UPLOADER_TEST_FRAMEWORK environment variable``
     */
    framework: string,

    /**
     * Framework.
     * You can set test format with FORESIGHT_UPLOADER_TEST_FORMAT environment variable 
     * instead of setting `format` field.
     * ``required | FORESIGHT_UPLOADER_TEST_FORMAT environment variable``
     */
    format: string,
}

export interface CoverageUploaderConfig extends UploaderConfig { 

    /**
     * format.
     * You can set coverage format with FORESIGHT_UPLOADER_COVERAGE_FORMAT environment variable 
     * instead of setting `format` field.
     * ``required | FORESIGHT_UPLOADER_COVERAGE_FORMAT environment variable``
     */
    format: string,
}