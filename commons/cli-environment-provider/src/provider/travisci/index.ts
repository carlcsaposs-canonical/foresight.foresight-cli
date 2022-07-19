import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { logger } from '@runforesight/foresight-cli-logger';
import * as GitHelper from '../git/helper';
import * as GitEnvironmentInfo from '../git';;

export const ENVIRONMENT = 'TravisCI';

let environmentInfo: EnvironmentInfo;

const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }

    const buildWebURL = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BUILD_WEB_URL_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BUILD_WEB_URL_ENV_VAR_NAME.toLowerCase()];
    const buildID = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BUILD_ID_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BUILD_ID_ENV_VAR_NAME.toLowerCase()];

    if (buildWebURL || buildID) {
        return CliRunUtils.getCliRunId(ENVIRONMENT, repoURL, commitHash, buildWebURL + '_' + buildID);
    } else {
        return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, repoURL, commitHash);
    }
};

const isTravisCIEnvironment = () => {
    return (process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_ENV_VAR_NAME.toLowerCase()] != null);
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate TravisCI Environment Info
 */
export const init = async (): Promise<void> => {
    try {
        if (environmentInfo == null && isTravisCIEnvironment()) {
            const travisRepoSlug = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_REPO_SLUG_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_REPO_SLUG_VAR_NAME.toLowerCase()];

            const repoURL = `https://github.com/${travisRepoSlug}.git`;

            const repoName = GitHelper.extractRepoName(repoURL);

            let branch = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_PULL_REQUEST_BRANCH_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_PULL_REQUEST_BRANCH_ENV_VAR_NAME.toLowerCase()];

            if (!branch) {
                branch = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BRANCH_ENV_VAR_NAME]
                    || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BRANCH_ENV_VAR_NAME.toLowerCase()];
            }

            let commitHash = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_COMMIT_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_COMMIT_ENV_VAR_NAME.toLowerCase()];

            let commitMessage = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_COMMIT_MESSAGE_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_COMMIT_MESSAGE_ENV_VAR_NAME.toLowerCase()];

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

            logger.debug('<TravisCIEnvironmentInfoProvider> Initialized TravisCI environment');
        }
    } catch (e) {
        logger.error(
            '<TravisCIEnvironmentInfoProvider> Unable to build environment info');
    }
};
