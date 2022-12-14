import { logger } from '@runforesight/foresight-cli-logger';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { UuidUtil } from '@runforesight/foresight-cli-utils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as GitHelper from '../git/helper';


export const ENVIRONMENT = 'Local';

export let defaultEnvironmentInfo: EnvironmentInfo;

const getCliRunId = () => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }
    const dummyRepoUrl = UuidUtil.generateId();
    const dummyCommitHash = UuidUtil.generateId();

    return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, dummyRepoUrl, dummyCommitHash);
};


/**
 * Initiate project Default information
 */
export const init = async (): Promise<EnvironmentInfo> => {
    if (defaultEnvironmentInfo) {
        return defaultEnvironmentInfo;
    }

    logger.debug('<DefaultHelper> Obtaining git environment information ...');
    defaultEnvironmentInfo = await GitHelper.init();
    if (!defaultEnvironmentInfo) {
        defaultEnvironmentInfo = new EnvironmentInfo(
            getCliRunId(),
            ENVIRONMENT,
            "",
            "",
            "",
            "",
            "",
            process.cwd(),
        );
    }
    logger.debug('<DefaultHelper> Obtained git environment information');

    return defaultEnvironmentInfo;
};
