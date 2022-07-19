
import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import * as GitHelper from '../git/helper';
import * as GitEnvironmentInfo from '../git';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { logger } from '@runforesight/foresight-cli-logger';

export const ENVIRONMENT = 'BitBucket';

let environmentInfo: EnvironmentInfo;

const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }

    const buildNumber = process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_BUILD_NUMBER_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.BITBUCKET_BUILD_NUMBER_ENV_VAR_NAME.toLowerCase()];

    if (buildNumber) {
        return CliRunUtils.getCliRunId(ENVIRONMENT, repoURL, commitHash, buildNumber);
    } else {
        return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, repoURL, commitHash);
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
            let gitRoot;
            if (gitEnvironmentInfo) {
                commitMessage = gitEnvironmentInfo.commitMessage;

                if (branch) {
                    branch = gitEnvironmentInfo.branch;
                }

                if (commitHash) {
                    commitHash = gitEnvironmentInfo.commitHash;
                }

                gitRoot = gitEnvironmentInfo.gitRoot;
            }

            environmentInfo = new EnvironmentInfo(
                getCliRunId(repoURL, commitHash),
                ENVIRONMENT,
                repoURL,
                repoName,
                branch,
                commitHash,
                commitMessage,
                gitRoot);

            logger.debug('<BitbucketEnvironmentInfoProvider> Initialized Bitbucket environment');
        }
    } catch (e) {
        logger.error(
            '<BitbucketEnvironmentInfoProvider> Unable to build environment info');
    }
};
