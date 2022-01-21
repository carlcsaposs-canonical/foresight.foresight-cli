import { ConfigProvider } from '@thundra/foresight-cli-config-provider';
import { EnvironmentSupport } from '@thundra/foresight-cli-environment-provider';
import { logger } from '@thundra/foresight-cli-logger';
import ConfigMetadata from '../config/ConfigMetadata'

export const init = async (options: any): Promise<void> => {
    logger.debug('<Init> init working ...');

    ConfigProvider.init(ConfigMetadata, options);
    await EnvironmentSupport.init();
};