export const UPLOADER_TMP_PREFIX = 'foresight_uploader';
export const UPLOADER_SIGNER_PATH = '/signedUrl';

export const UPLOADER_METADATA_FILENAME = 'CLI_REPORT_METADATA.json';

export interface KeyValueType {
    [key: string]: string;
}

export const UPLOADER_SIGNED_URL_TYPES: KeyValueType = Object.freeze({
    TEST: 'TEST',
    COVERAGE: 'COVERAGE',
});

export const ALLOWED_COMMANDER_EXIT_CODES = [   
    'commander.version',
    'commander.help',
    'commander.helpDisplayed',
];
 
export const TEST_FRAMEWORK_TYPES: KeyValueType = Object.freeze({
    TESTNG: 'TESTNG',
    JUNIT: 'JUNIT',
    JEST: 'JEST',
    PYTEST: 'PYTEST',
    XUNIT2: 'XUNIT2',
    GOLANG: 'GOLANG'
});

export const TEST_FORMAT_TYPES: KeyValueType = Object.freeze({
    TESTNG: 'TESTNG',
    JUNIT: 'JUNIT',
    XUNIT2: 'XUNIT2',
    TRX: 'TRX',
    TEXT: 'TEXT',
    JSON: 'JSON'
});

export const COVERAGE_FORMAT_TYPES: KeyValueType = Object.freeze({
    'JACOCO': 'JACOCO/XML',
    'JACOCO/XML': 'JACOCO/XML',
    'COBERTURA': 'COBERTURA/XML',
    'COBERTURA/XML': "COBERTURA/XML",
    'GOLANG': 'GOLANG'
});