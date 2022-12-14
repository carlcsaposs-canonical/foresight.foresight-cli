import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { logger } from '@runforesight/foresight-cli-logger';
import * as GitHelper from '../git/helper';
import * as DefaultHelper from '../default/helper';

export const ENVIRONMENT = 'Jenkins';

let environmentInfo: EnvironmentInfo;

const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }

    const jobName = process.env[ENVIRONMENT_VARIABLE_NAMES.JOB_NAME_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.JOB_NAME_ENV_VAR_NAME.toLowerCase()];
    const buildId = process.env[ENVIRONMENT_VARIABLE_NAMES.BUILD_ID_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.BUILD_ID_ENV_VAR_NAME.toLowerCase()];

    if (jobName || buildId) {
        return CliRunUtils.getCliRunId(ENVIRONMENT, repoURL, commitHash, jobName + '_' + buildId);
    } else {
        return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, repoURL, commitHash);
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

            const defaultEnvironmentInfo = await DefaultHelper.init();

            let commitMessage = '';
            let root;
            if (defaultEnvironmentInfo) {
                commitMessage = defaultEnvironmentInfo.commitMessage;

                if (branch) {
                    branch = defaultEnvironmentInfo.branch;
                }

                if (commitHash) {
                    commitHash = defaultEnvironmentInfo.commitHash;
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

            logger.debug('<JenkinsEnvironmentInfoProvider> Initialized Jenkins environment');
        }
    } catch (e) {
        logger.error(
            '<JenkinsEnvironmentInfoProvider> Unable to build environment info');
    }
};
