import GithubEnvironmentInfo from '../../model/GithubEnvironmentInfo';
import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as CliRunUtils from '../../utils/CliRunUtils';
import * as GitHelper from '../git/helper';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@thundra/foresight-cli-config-provider';
import { logger } from '@thundra/foresight-cli-logger';
import { extractRepoName } from '../git/helper';
import * as fs from 'fs';
import * as util from 'util';

export const ENVIRONMENT = 'Github';
const REFS_HEADS_PREFIX = 'refs/heads/';
let environmentInfo: EnvironmentInfo;

const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.THUNDRA_FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }

    const githubRunId = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_RUN_ID_ENV_VAR_NAME]
        || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_RUN_ID_ENV_VAR_NAME.toLowerCase()];
    if (githubRunId) {
        const invocationId = process.env[ENVIRONMENT_VARIABLE_NAMES.INVOCATION_ID_ENV_VAR_NAME]
            || process.env[ENVIRONMENT_VARIABLE_NAMES.INVOCATION_ID_ENV_VAR_NAME.toLowerCase()];
        return CliRunUtils.getCliRunId(ENVIRONMENT, repoURL, commitHash, githubRunId + '_' + invocationId);
    } else {
        return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, repoURL, commitHash);
    }
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate Github Environment Info
 */
export const init = async (): Promise<void> => {
    try {
        if (environmentInfo == null) {
            const gitEnvironmentInfo = await GitHelper.init();
            const githubRepo = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_REPOSITORY_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_REPOSITORY_ENV_VAR_NAME.toLowerCase()];
            if (!githubRepo) {
                return null;
            }
            const repoURL = `https://github.com/${githubRepo}.git`;
            const repoName = extractRepoName(githubRepo);
            let branch = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_HEAD_REF_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_HEAD_REF_ENV_VAR_NAME.toLowerCase()];
            let commitHash = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_SHA_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_SHA_ENV_VAR_NAME.toLowerCase()];

            const githubEventPath = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_EVENT_PATH_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_EVENT_PATH_ENV_VAR_NAME.toLowerCase()];
            if (githubEventPath) {
                try {
                    const readFile = util.promisify(fs.readFile);
                    const eventJSON = JSON.parse(await readFile(githubEventPath, 'utf8'));
                    commitHash = eventJSON.pull_request.head.sha; // get(eventJSON, 'pull_request.head.sha');
                } catch (e) {
                    logger.debug(`Unable to read GitHub event from file ${githubEventPath}`);
                }
            }

            if (!branch) {
                branch = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_REF_ENV_VAR_NAME]
                    || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_REF_ENV_VAR_NAME.toLowerCase()];
                if (branch && branch.startsWith(REFS_HEADS_PREFIX)) {
                    branch = branch.substring(REFS_HEADS_PREFIX.length);
                }
            }

            const githubRunId = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_RUN_ID_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_RUN_ID_ENV_VAR_NAME.toLowerCase()];
            const githubRunAttempt = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_RUN_ATTEMPT_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_RUN_ATTEMPT_ENV_VAR_NAME.toLowerCase()];
            const githubRunnerName = process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_RUNNER_NAME_ENV_VAR_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.GITHUB_RUNNER_NAME_ENV_VAR_NAME.toLowerCase()];
            const githubJobId = process.env[ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_WORKFLOW_JOB_ID]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_WORKFLOW_JOB_ID.toLowerCase()];
            const githubJobName = process.env[ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_WORKFLOW_JOB_NAME]
                || process.env[ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_WORKFLOW_JOB_NAME.toLowerCase()];

            let commitMessage = '';
            let gitRoot;

            if (gitEnvironmentInfo) {
                if (!branch) {
                    branch = gitEnvironmentInfo.branch;
                }
    
                if (!commitHash) {
                    commitHash = gitEnvironmentInfo.commitHash;
                }

                commitMessage = gitEnvironmentInfo.commitMessage;
                gitRoot = gitEnvironmentInfo.gitRoot;
            }

            environmentInfo = new GithubEnvironmentInfo(
                getCliRunId(repoURL, commitHash),
                ENVIRONMENT,
                repoURL,
                repoName,
                branch,
                commitHash,
                commitMessage,
                githubRunId,
                githubRunAttempt,
                githubRunnerName,
                githubJobId,
                githubJobName,
                gitRoot);

            logger.debug('<GithubEnvironmentInfoProvider> Initialized Github environment');
        }
    } catch (e) {
        logger.error(
            '<GithubEnvironmentInfoProvider> Unable to build environment info');
    }
};