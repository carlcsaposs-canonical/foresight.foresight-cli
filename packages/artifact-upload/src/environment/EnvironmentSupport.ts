import EnvironmentInfo from '../model/EnvironmentInfo';
import * as InfoProvider from './';

let environmentInfo: EnvironmentInfo;

/**
 * Initiate all environment providers and set non empty one
 */
export const init = async (): Promise<void> => {
    // log

    await InfoProvider.init();

    Object.values(InfoProvider.environmentInfoProviders).forEach((environmentInfoProvider) => {
        const ei: EnvironmentInfo = environmentInfoProvider.getEnvironmentInfo();
        if (ei != null) {
            // log
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