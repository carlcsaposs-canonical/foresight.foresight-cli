
import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import * as GitHelper from '../git/helper';
import * as GitEnvironmentInfo from '../git';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@thundra-foresight/cli-config-provider';
import { logger } from '@thundra-foresight/cli-logger';

export const ENVIRONMENT = 'BitBucket';

let environmentInfo: EnvironmentInfo;

const getTestRunId = (repoURL: string, commitHash: string) => {
    const testRunId = ConfigProvider.get<string>(ENVIRONMENT_VARIABLE_NAMES.THUNDRA_AGENT_CLI_RUN_ID);
    if (testRunId) {
        return testRunId;
    }

    const buildNumber = process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_BUILD_NUMBER_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_BUILD_NUMBER_ENV_VAR_NAME.toLowerCase()];

    if (buildNumber) {
        return CliRunUtils.getTestRunId(ENVIRONMENT, repoURL, commitHash, buildNumber);
    } else {
        return CliRunUtils.getDefaultTestRunId(ENVIRONMENT, repoURL, commitHash);
    }
};

const isBitBucketEnvironment = () => {
    return (process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_GIT_HTTP_ORIGIN_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_GIT_HTTP_ORIGIN_ENV_VAR_NAME.toLowerCase()] != null);
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate Bitbucket Environment Info
 */
export const init = async (): Promise<void> => {
    try {
        if (environmentInfo == null && isBitBucketEnvironment()) {
            let repoURL = process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_GIT_HTTP_ORIGIN_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_GIT_HTTP_ORIGIN_ENV_VAR_NAME.toLowerCase()];
            if (!repoURL) {
                repoURL = process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_GIT_SSH_ORIGIN_ENV_VAR_NAME]
                    || process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_GIT_SSH_ORIGIN_ENV_VAR_NAME.toLowerCase()];
            }

            const repoName = GitHelper.extractRepoName(repoURL);

            let branch = process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_BRANCH_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_BRANCH_ENV_VAR_NAME.toLowerCase()];

            let commitHash = process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_COMMIT_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_COMMIT_ENV_VAR_NAME.toLowerCase()];

            const gitEnvironmentInfo = GitEnvironmentInfo.getEnvironmentInfo();

            let commitMessage = '';
            if (gitEnvironmentInfo) {
                commitMessage = gitEnvironmentInfo.commitMessage;

                if (branch) {
                    branch = gitEnvironmentInfo.branch;
                }

                if (commitHash) {
                    commitHash = gitEnvironmentInfo.commitHash;
                }
            }

            const testRunId = getTestRunId(repoURL, commitHash);

            environmentInfo = new EnvironmentInfo(testRunId, ENVIRONMENT, repoURL, repoName, branch, commitHash, commitMessage);
        }
    } catch (e) {
        logger.error(
            '<BitbucketEnvironmentInfoProvider> Unable to build environment info');
    }
};
