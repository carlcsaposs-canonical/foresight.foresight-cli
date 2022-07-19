import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { logger} from '@runforesight/foresight-cli-logger';
import { TestUploaderConfig } from '../../config/ConfigNames';
import { TestUploaderConfigMetadata } from '../../config/ConfigMetadata'
import { init } from '../';

export const initTest = async (options: TestUploaderConfig): Promise<void> => {
    logger.debug('<TestInit> Test init working ...');

    ConfigProvider.init({ 
        configMetaData: { ...TestUploaderConfigMetadata }, 
        config: options });

    await init();
};