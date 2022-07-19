import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@thundra/foresight-cli-config-provider';
import { logger } from '@thundra/foresight-cli-logger';
import * as GitHelper from '../git/helper';
import * as GitEnvironmentInfo from '../git';

export const ENVIRONMENT = 'GitLab';

let environmentInfo: EnvironmentInfo;

const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.THUNDRA_FORESIGHT_CLI_RUN_ID);
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

            let gitRoot;
            const gitEnvironmentInfo = GitEnvironmentInfo.getEnvironmentInfo();
            if (gitEnvironmentInfo) {
                if (!branch) {
                    branch = gitEnvironmentInfo.branch;
                }

                if (!commitHash) {
                    commitHash = gitEnvironmentInfo.commitHash;
                }

                if (!commitMessage) {
                    commitMessage = gitEnvironmentInfo.commitMessage;
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

            logger.debug('<GitlabEnvironmentInfoProvider> Initialized Gitlab environment');
        }
    } catch (e) {
        logger.error(
            '<GitlabEnvironmentInfoProvider> Unable to build environment info');
    }
};
