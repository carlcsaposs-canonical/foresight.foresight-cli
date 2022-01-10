import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@thundra-foresight/cli-config-provider';
import { logger } from '@thundra-foresight/cli-logger';
import * as GitHelper from '../git/helper';
import * as GitEnvironmentInfo from '../git';

export const ENVIRONMENT = 'GitLab';

let environmentInfo: EnvironmentInfo;

const getTestRunId = (repoURL: string, commitHash: string) => {
    const testRunId = ConfigProvider.get<string>(ENVIRONMENT_VARIABLE_NAMES.THUNDRA_AGENT_CLI_RUN_ID);
    if (testRunId) {
        return testRunId;
    }

    const jobURL = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_JOB_URL_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_JOB_URL_ENV_VAR_NAME.toLowerCase()];
    const jobId = process.env[ENVIRONMENT_VARIABLE_NAMES.CI_JOB_ID_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CI_JOB_ID_ENV_VAR_NAME.toLowerCase()];

    if (jobURL || jobId) {
        return CliRunUtils.getTestRunId(ENVIRONMENT, repoURL, commitHash, jobURL + '_' + jobId);
    } else {
        return CliRunUtils.getDefaultTestRunId(ENVIRONMENT, repoURL, commitHash);
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
            }

            const testRunId = getTestRunId(repoURL, commitHash);

            environmentInfo = new EnvironmentInfo(testRunId, ENVIRONMENT, repoURL, repoName, branch, commitHash, commitMessage);
        }
    } catch (e) {
        logger.error(
            '<GitlabEnvironmentInfoProvider> Unable to build environment info');
    }
};
