import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { logger} from '@runforesight/foresight-cli-logger';
import { CoverageUploaderConfig } from '../../config/ConfigNames';
import { CoveragetUploaderConfigMetadata } from '../../config/ConfigMetadata'
import { init } from '../';

export const initCoverage = async (options: CoverageUploaderConfig): Promise<void> => {
    logger.debug('<CoverageInit> Coverage init working ...');

    ConfigProvider.init({ 
        configMetaData: { ...CoveragetUploaderConfigMetadata }, 
        config: options });

    await init();
};