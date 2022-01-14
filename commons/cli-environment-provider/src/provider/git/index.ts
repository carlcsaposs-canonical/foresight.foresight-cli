import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as GitHelper from './helper';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { logger } from '@thundra/foresight-cli-logger';
import { ConfigProvider } from '@thundra/foresight-cli-config-provider';

export const ENVIRONMENT = 'Git';

let environmentInfo: EnvironmentInfo;

const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.get<string>(ENVIRONMENT_VARIABLE_NAMES.THUNDRA_FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }

    return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, repoURL, commitHash);
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate Git Environment Info
 */
export const init = async (): Promise<void> => {
    if (environmentInfo == null) {
        logger.debug('<GitEnvironmentProvider> Initializing git environment ...');

        const gitEnvironmentInfo = await GitHelper.init();
        if (gitEnvironmentInfo != null) {
            const repoURL = gitEnvironmentInfo.repoURL;
            const repoName = gitEnvironmentInfo.repoName;
            const branch = gitEnvironmentInfo.branch;
            const commitHash = gitEnvironmentInfo.commitHash;
            const commitMessage = gitEnvironmentInfo.commitMessage;

            const cliRunId = getCliRunId(repoURL, commitHash);

            environmentInfo = new EnvironmentInfo(
                cliRunId,
                ENVIRONMENT,
                repoURL,
                repoName,
                branch,
                commitHash,
                commitMessage);

            logger.debug('<GitEnvironmentProvider> Initialized git environment ...');
        }
    }
};
