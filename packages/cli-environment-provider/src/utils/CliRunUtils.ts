import { Utils } from '@thundra/foresight-cli-utils';

export const getCliRunId = (
    environment: string,
    repoURL: string,
    commitHash: string,
    cliRunKey: string): string => {

    const cliRunIdSeed = environment + '_' + repoURL + '_' + commitHash + '_' + cliRunKey;

    return Utils.generareIdFrom(cliRunIdSeed);
};

export const getDefaultCliRunId = (
    environment: string,
    repoURL: string,
    commitHash: string): string => {

    /** todo: generate more unique id from parente process ? */
    const runId = process.ppid + '_';

    return getCliRunId(
        environment,
        repoURL,
        commitHash,
        runId,
    );
};