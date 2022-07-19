import { ConfigProvider } from '@thundra/foresight-cli-config-provider';
import { EnvironmentSupport } from '@thundra/foresight-cli-environment-provider';
import { logger, LoggerType } from '@thundra/foresight-cli-logger';
import { ConfigNames } from '../config/ConfigNames';

export const init = async (): Promise<void> => {
    logger.debug('<Init> init working ...');

    const logLevel = ConfigProvider.get<LoggerType.LogLevel>(ConfigNames.general.logLevel);
    if (logLevel) {
        logger.setLogLevel(logLevel);
    }

    await EnvironmentSupport.init();
};