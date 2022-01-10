import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as GitHelper from './helper';
import * as TestRunnerUtils from '../../utils/TestRunnerUtils';
import ConfigNames from '../../config/ConfigNames';
import ConfigProvider from '../../config/ConfigProvider';
import logger from '../../logger';

export const ENVIRONMENT = 'Git';

let environmentInfo: EnvironmentInfo;

const getTestRunId = (repoURL: string, commitHash: string) => {
    const testRunId = ConfigProvider.get<string>(ConfigNames.THUNDRA_AGENT_TEST_RUN_ID);
    if (testRunId) {
        return testRunId;
    }

    return TestRunnerUtils.getDefaultTestRunId(ENVIRONMENT, repoURL, commitHash);
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate Git Environment Info
 */
export const init = async (): Promise<void> => {
    if (environmentInfo == null) {
        logger.debug('<GitEnvironmentProvider> Initializing git environment ...');

        const gitEnvironmentInfo = await GitHelper.init();
        if (gitEnvironmentInfo != null) {
            const repoURL = gitEnvironmentInfo.repoURL;
            const repoName = gitEnvironmentInfo.repoName;
            const branch = gitEnvironmentInfo.branch;
            const commitHash = gitEnvironmentInfo.commitHash;
            const commitMessage = gitEnvironmentInfo.commitMessage;

            const testRunId = getTestRunId(repoURL, commitHash);

            environmentInfo = new EnvironmentInfo(
                testRunId,
                ENVIRONMENT,
                repoURL,
                repoName,
                branch,
                commitHash,
                commitMessage);

            logger.debug('<GitEnvironmentProvider> Initialized git environment ...');
        }
    }
};
