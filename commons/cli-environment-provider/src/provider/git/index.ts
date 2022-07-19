import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as GitHelper from './helper';
import { logger } from '@runforesight/foresight-cli-logger';

export const ENVIRONMENT = GitHelper.ENVIRONMENT;

let environmentInfo: EnvironmentInfo;

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
            environmentInfo = gitEnvironmentInfo;
            logger.debug('<GitEnvironmentProvider> Initialized git environment');
        }
    }
};
