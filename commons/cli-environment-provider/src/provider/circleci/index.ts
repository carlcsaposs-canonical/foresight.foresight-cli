
import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import * as GitHelper from '../git/helper';
import * as DefaultHelper from '../default/helper';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { logger } from '@runforesight/foresight-cli-logger';
export const ENVIRONMENT = 'CircleCI';

let environmentInfo: EnvironmentInfo;

const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }

    const buildURL = process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_URL_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_URL_ENV_VAR_NAME.toLowerCase()];
    const buildNum = process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_NUM_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.CIRCLE_BUILD_NUM_ENV_VAR_NAME.toLowerCase()];

    if (buildURL || buildNum) {
        return CliRunUtils.getCliRunId(ENVIRONMENT, repoURL, commitHash, buildURL + '_' + buildNum);
    } else {
        return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, repoURL, commitHash);
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
            let root;

            const defaultEnvironmentInfo = await DefaultHelper.init();
            if (defaultEnvironmentInfo) {
                commitMessage = defaultEnvironmentInfo.commitMessage;

                if (!branch) {
                    branch = defaultEnvironmentInfo.branch;
                }

                if (!commitHash) {
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

            logger.debug('<CircleCIEnvironmentInfoProvider> Initialized CircleCI environment');
        }
    } catch (e) {
        logger.error(
            '<CircleCIEnvironmentInfoProvider> Unable to build environment info');
    }
};
