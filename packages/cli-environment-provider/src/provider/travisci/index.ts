import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@thundra-foresight/cli-config-provider';
import { logger } from '@thundra-foresight/cli-logger';
import * as GitHelper from '../git/helper';
import * as GitEnvironmentInfo from '../git';;

export const ENVIRONMENT = 'TravisCI';

let environmentInfo: EnvironmentInfo;

const getTestRunId = (repoURL: string, commitHash: string) => {
    const testRunId = ConfigProvider.get<string>(ENVIRONMENT_VARIABLE_NAMES.THUNDRA_AGENT_CLI_RUN_ID);
    if (testRunId) {
        return testRunId;
    }

    const buildWebURL = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BUILD_WEB_URL_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BUILD_WEB_URL_ENV_VAR_NAME.toLowerCase()];
    const buildID = process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BUILD_ID_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.TRAVIS_BUILD_ID_ENV_VAR_NAME.toLowerCase()];

    if (buildWebURL || buildID) {
        return CliRunUtils.getTestRunId(ENVIRONMENT, repoURL, commitHash, buildWebURL + '_' + buildID);
    } else {
        return CliRunUtils.getDefaultTestRunId(ENVIRONMENT, repoURL, commitHash);
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
            '<TravisCIEnvironmentInfoProvider> Unable to build environment info');
    }
};
