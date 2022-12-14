import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { logger } from '@runforesight/foresight-cli-logger';
import * as GitHelper from '../git/helper';
import * as DefaultHelper from '../default/helper';

export const ENVIRONMENT = 'GitLab';

let environmentInfo: EnvironmentInfo;

const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }

    const jobURL = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_JOB_URL_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_JOB_URL_ENV_VAR_NAME.toLowerCase()];
    const jobId = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_JOB_ID_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_JOB_ID_ENV_VAR_NAME.toLowerCase()];

    if (jobURL || jobId) {
        return CliRunUtils.getCliRunId(ENVIRONMENT, repoURL, commitHash, jobURL + '_' + jobId);
    } else {
        return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, repoURL, commitHash);
    }
};

const isGitLabEnvironment = () => {
    return (process.env[ENVIRONMENT_VARIABLE_NAMES.GITLAB_CI_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.GITLAB_CI_ENV_VAR_NAME.toLowerCase()] != null);
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate Gitlab Environment Info
 */
export const init = async (): Promise<void> => {
    try {
        if (environmentInfo == null && isGitLabEnvironment()) {
            const repoURL = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_REPOSITORY_URL_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_REPOSITORY_URL_ENV_VAR_NAME.toLowerCase()];

            const repoName = GitHelper.extractRepoName(repoURL);

            let branch = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_COMMIT_BRANCH_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_COMMIT_BRANCH_ENV_VAR_NAME.toLowerCase()];

            if (branch) {
                branch = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_COMMIT_REF_NAME_ENV_VAR_NAME]
                    || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_COMMIT_REF_NAME_ENV_VAR_NAME.toLowerCase()];
            }

            let commitHash = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_COMMIT_SHA_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_COMMIT_SHA_ENV_VAR_NAME.toLowerCase()];

            let commitMessage = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_COMMIT_MESSAGE_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_COMMIT_MESSAGE_ENV_VAR_NAME.toLowerCase()];

            let root;
            const defaultEnvironmentInfo = await DefaultHelper.init();
            if (defaultEnvironmentInfo) {
                if (!branch) {
                    branch = defaultEnvironmentInfo.branch;
                }

                if (!commitHash) {
                    commitHash = defaultEnvironmentInfo.commitHash;
                }

                if (!commitMessage) {
                    commitMessage = defaultEnvironmentInfo.commitMessage;
                }

                root = defaultEnvironmentInfo.root;
            }

            environmentInfo = new EnvironmentInfo(
                getCliRunId(repoURL, commitHash),
                ENVIRONMENT,
                repoURL,
                repoName,
                branch,
                commitHash,
                commitMessage,
                root);

            logger.debug('<GitlabEnvironmentInfoProvider> Initialized Gitlab environment');
        }
    } catch (e) {
        logger.error(
            '<GitlabEnvironmentInfoProvider> Unable to build environment info');
    }
};
