import EnvironmentInfo from '../../model/EnvironmentInfo';
import * as DefaultHelper from './helper';
import { logger } from '@runforesight/foresight-cli-logger';

export const ENVIRONMENT = DefaultHelper.ENVIRONMENT;

let environmentInfo: EnvironmentInfo;

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};

/**
 * Initiate Default Environment Info
 */
export const init = async (): Promise<void> => {
    if (environmentInfo == null) {
        logger.debug('<DefaultEnvironmentProvider> Initializing default environment ...');

        const defaultEnvironmentInfo = await DefaultHelper.init();
        if (defaultEnvironmentInfo != null) {
            environmentInfo = defaultEnvironmentInfo;
            logger.debug('<DefaultEnvironmentProvider> Initialized default environment');
        }
    }
};
