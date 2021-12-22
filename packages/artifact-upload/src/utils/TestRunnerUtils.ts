import Utils from './Utils';

/**
 * Util class for test run process
 */
export default class TestRunnerUtils {

    /**
     * Generate and return test run id
     * @param environment environment
     * @param repoURL repoURL
     * @param commitHash commitHash
     * @param testRunKey testRunKey
     */
    static getTestRunId(
        environment: string,
        repoURL: string,
        commitHash: string,
        testRunKey: string): string {

        const testRunIdSeed = environment + '_' + repoURL + '_' + commitHash + '_' + testRunKey;

        return Utils.generareIdFrom(testRunIdSeed);
    }

    /**
     * Generate and return test run id according to default behaviour
     * @param environment environment
     * @param repoURL repoURL
     * @param commitHash commitHash
     */
    static getDefaultTestRunId(
        environment: string,
        repoURL: string,
        commitHash: string): string {

        /** todo: generate more unique id from parente process ? */
        const runId = process.ppid + '_';

        return TestRunnerUtils.getTestRunId(
            environment,
            repoURL,
            commitHash,
            runId,
        );
    }
}