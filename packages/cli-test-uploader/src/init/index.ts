import ConfigProvider from '../config/ConfigProvider';
import * as EnvironmentSupport from '../environment/EnvironmentSupport';
import logger from '../logger';

export const init = async (options: any): Promise<void> => {
    logger.debug('<Init> init working ...');

    ConfigProvider.init(options);
    await EnvironmentSupport.init();
};