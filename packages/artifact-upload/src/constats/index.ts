export const UPLOADER_TMP_PREFIX = 'THUNDRA_UPLOADS';
export const UPLOADER_UUID_CONST = '3cda958c-e704-56ff-b519-ab2e3dc3ccc3';

export interface KeyValueType {
    [key: string]: string;
};
 
export const FILE_TYPES: KeyValueType = Object.freeze({ 
    TEST: 'TEST',
});

export const CI_PROVIDER_TYPES: KeyValueType = Object.freeze({
    GITHUB: "GITHUB",
});

export const FRAMEWORK_TYPES: KeyValueType = Object.freeze({
    TESTNG: "TESTNG",
    JUNIT: "JUNIT",
    JEST: "JEST",
    PYTHON: "PYTHON",
    TRX: "TRX",
    XUNIT2: "XUNIT2",
});