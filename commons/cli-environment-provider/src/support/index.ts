import EnvironmentInfo from '../model/EnvironmentInfo';
import * as InfoProvider from '../provider';
import { logger } from '@runforesight/foresight-cli-logger';

let environmentInfo: EnvironmentInfo;

/**
 * Initiate all environment providers and set non empty one
 */
export const init = async (): Promise<void> => {
    logger.debug('<EnvironmentSupport> Environments initilizing ...');

    await InfoProvider.init();

    Object.values(InfoProvider.environmentInfoProviders).forEach((environmentInfoProvider) => {
        const ei: EnvironmentInfo = environmentInfoProvider.getEnvironmentInfo();
        if (ei != null) {
            logger.debug(`<EnvironmentSupport> Environment loaded. ${ei.environment}`);
            environmentInfo = ei;
            return;
        }
    });
};

/**
 * Get environment info
 */
export const getEnvironmentInfo = (): EnvironmentInfo => {
    return environmentInfo;
};