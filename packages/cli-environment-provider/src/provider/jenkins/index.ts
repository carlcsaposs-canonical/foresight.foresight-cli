import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@thundra-foresight/cli-config-provider';
import { logger } from '@thundra-foresight/cli-logger';
import * as GitHelper from '../git/helper';
import * as GitEnvironmentInfo from '../git';

export const ENVIRONMENT = 'Jenkins';

let environmentInfo: EnvironmentInfo;

const getTestRunId = (repoURL: string, commitHash: string) => {
    const testRunId = ConfigProvider.get<string>(ENVIRONMENT_VARIABLE_NAMES.THUNDRA_AGENT_CLI_RUN_ID);
    if (testRunId) {
        return testRunId;
    }

    const jobName = process.env[ENVIRONMENT_VARIABLE_NAMES.JOB_NAME_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.JOB_NAME_ENV_VAR_NAME.toLowerCase()];
    const buildId = process.env[ENVIRONMENT_VARIABLE_NAMES.BUILD_ID_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.BUILD_ID_ENV_VAR_NAME.toLowerCase()];

    if (jobName || buildId) {
        return CliRunUtils.getTestRunId(ENVIRONMENT, repoURL, commitHash, jobName + '_' + buildId);
    } else {
        return CliRunUtils.getDefaultTestRunId(ENVIRONMENT, repoURL, commitHash);
    }
};

const isJenkinsEnvironment = () => {
    return (process.env[ENVIRONMENT_VARIABLE_NAMES.JENKINS_HOME_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.JENKINS_HOME_ENV_VAR_NAME.toLowerCase()] != null);
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate Jenkins Environment Info
 */
export const init = async (): Promise<void> => {
    try {
        if (environmentInfo == null && isJenkinsEnvironment()) {
            let repoURL = process.env[ENVIRONMENT_VARIABLE_NAMES.GIT_URL_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GIT_URL_ENV_VAR_NAME.toLowerCase()];

            if (repoURL) {
                repoURL = process.env[ENVIRONMENT_VARIABLE_NAMES.GIT_URL_1_ENV_VAR_NAME]
                    || process.env[ENVIRONMENT_VARIABLE_NAMES.GIT_URL_1_ENV_VAR_NAME.toLowerCase()];
            }

            const repoName = GitHelper.extractRepoName(repoURL);

            let branch = process.env[ENVIRONMENT_VARIABLE_NAMES.GIT_BRANCH_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GIT_BRANCH_ENV_VAR_NAME.toLowerCase()];

            let commitHash = process.env[ENVIRONMENT_VARIABLE_NAMES.GIT_COMMIT_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GIT_COMMIT_ENV_VAR_NAME.toLowerCase()];

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
            '<JenkinsEnvironmentInfoProvider> Unable to build environment info');
    }
};
