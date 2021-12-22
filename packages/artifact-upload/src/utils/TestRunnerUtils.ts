import * as Utils from './Utils';

export const getTestRunId = (
    environment: string,
    repoURL: string,
    commitHash: string,
    testRunKey: string): string => {

    const testRunIdSeed = environment + '_' + repoURL + '_' + commitHash + '_' + testRunKey;

    return Utils.generareIdFrom(testRunIdSeed);
};

export const getDefaultTestRunId = (
    environment: string,
    repoURL: string,
    commitHash: string): string => {

    /** todo: generate more unique id from parente process ? */
    const runId = process.ppid + '_';

    return getTestRunId(
        environment,
        repoURL,
        commitHash,
        runId,
    );
};