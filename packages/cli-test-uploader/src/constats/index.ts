export const UPLOADER_TMP_PREFIX = 'thundra_uploader';
export const UPLOADER_METADATA_FILENAME = 'CLI_REPORT_METADATA.json';
export const UPLOADER_UUID_CONST = '3cda958c-e704-56ff-b519-ab2e3dc3ccc3';
export const UPLOADER_LOG_PREFIX = 'Foresight-CLI-TEST-UPLOADER';
export const UPLOADER_SIGNER_PATH = '/signedUrl';

export interface KeyValueType {
    [key: string]: string;
}
 
export const FILE_TYPES: KeyValueType = Object.freeze({ 
    TEST: 'TEST',
});

export const FRAMEWORK_TYPES: KeyValueType = Object.freeze({
    TESTNG: 'TESTNG',
    JUNIT: 'JUNIT',
    JEST: 'JEST',
    PYTHON: 'PYTHON',
    TRX: 'TRX',
    XUNIT2: 'XUNIT2',
});