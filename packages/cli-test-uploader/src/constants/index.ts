export const UPLOADER_TMP_PREFIX = 'thundra_uploader';
export const UPLOADER_SIGNER_PATH = '/signedUrl';
export const UPLOADER_SIGNED_URL_TYPE = 'TEST';

export const ALLOWED_COMMANDER_EXIT_CODES = [   
    'commander.version',
    'commander.help',
    'commander.helpDisplayed',
];

export interface KeyValueType {
    [key: string]: string;
}
 
export const FRAMEWORK_TYPES: KeyValueType = Object.freeze({
    TESTNG: 'TESTNG',
    JUNIT: 'JUNIT',
    JEST: 'JEST',
    PYTHON: 'PYTHON',
    TRX: 'TRX',
    XUNIT2: 'XUNIT2',
});