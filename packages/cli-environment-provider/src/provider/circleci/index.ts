
import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import * as GitHelper from '../git/helper';
import * as GitEnvironmentInfo from '../git';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@thundra-foresight/cli-config-provider';
import { logger } from '@thundra-foresight/cli-logger';
export const ENVIRONMENT = 'CircleCI';

let environmentInfo: EnvironmentInfo;

const getTestRunId = (repoURL: string, commitHash: string) => {
    const testRunId = ConfigProvider.get<string>(ENVIRONMENT_VARIABLE_NAMES.THUNDRA_AGENT_CLI_RUN_ID);
    if (testRunId) {
        return testRunId;
    }

    const buildURL = process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_URL_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_URL_ENV_VAR_NAME.toLowerCase()];
    const buildNum = process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_NUM_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_NUM_ENV_VAR_NAME.toLowerCase()];

    if (buildURL || buildNum) {
        return CliRunUtils.getTestRunId(ENVIRONMENT, repoURL, commitHash, buildURL + '_' + buildNum);
    } else {
        return CliRunUtils.getDefaultTestRunId(ENVIRONMENT, repoURL, commitHash);
    }
};

const isCircleCIEnvironment = () => {
    return (process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLECI_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLECI_ENV_VAR_NAME.toLowerCase()] != null);
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate CircleCI Environment Info
 */
export const init = async (): Promise<void> => {
    try {
        if (environmentInfo == null && isCircleCIEnvironment()) {
            const repoURL = process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_REPOSITORY_URL_ENV_VAR_NAME]
            || process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_URL_ENV_VAR_NAME.toLowerCase()];

            const repoName = GitHelper.extractRepoName(repoURL);

            let branch = process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BRANCH_ENV_VAR_NAME]
            || process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BRANCH_ENV_VAR_NAME.toLowerCase()];

            let commitHash = process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_SHA1_ENV_VAR_NAME]
            || process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_SHA1_ENV_VAR_NAME.toLowerCase()];

            let commitMessage = '';

            const gitEnvironmentInfo = GitEnvironmentInfo.getEnvironmentInfo();
            if (gitEnvironmentInfo) {
                commitMessage = gitEnvironmentInfo.commitMessage;

                if (!branch) {
                    branch = gitEnvironmentInfo.branch;
                }

                if (!commitHash) {
                    commitHash = gitEnvironmentInfo.commitHash;
                }
            }

            const testRunId = getTestRunId(repoURL, commitHash);

            environmentInfo = new EnvironmentInfo(testRunId, ENVIRONMENT, repoURL, repoName, branch, commitHash, commitMessage);
        }
    } catch (e) {
        logger.error(
            '<CircleCIEnvironmentInfoProvider> Unable to build environment info');
    }
};
