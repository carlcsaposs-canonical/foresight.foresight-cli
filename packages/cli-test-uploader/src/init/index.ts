import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { EnvironmentSupport } from '@runforesight/foresight-cli-environment-provider';
import { logger, LoggerType } from '@runforesight/foresight-cli-logger';
import { ConfigNames } from '../config/ConfigNames';

export const init = async (): Promise<void> => {
    logger.debug('<Init> init working ...');

    const logLevel = ConfigProvider.get<LoggerType.LogLevel>(ConfigNames.general.logLevel);
    if (logLevel) {
        logger.setLogLevel(logLevel);
    }

    await EnvironmentSupport.init();
};