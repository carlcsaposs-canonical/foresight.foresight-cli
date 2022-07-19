import { UuidUtil } from '@thundra/foresight-cli-utils';
const os = require('os');

export const getCliRunId = (
    environment: string,
    repoURL: string,
    commitHash: string,
    cliRunKey: string): string => {

    const cliRunIdSeed = environment + '_' + repoURL + '_' + commitHash + '_' + cliRunKey;

    return UuidUtil.generareIdFrom(cliRunIdSeed);
};

export const getDefaultCliRunId = (
    environment: string,
    repoURL: string,
    commitHash: string): string => {

    /** todo: generate more unique id from parente process ? */
    const runId = os.hostname() + '_' + process.ppid + '_';

    return getCliRunId(
        environment,
        repoURL,
        commitHash,
        runId,
    );
};