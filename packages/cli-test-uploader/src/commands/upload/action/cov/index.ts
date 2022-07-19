
import { logger } from '@thundra/foresight-cli-logger';
import { UPLOADER_SIGNED_URL_TYPES } from '../../../../constants';
import { initCoverage } from '../../../../init/cov';
import Upload from '..';
import { ConfigProvider } from '@thundra/foresight-cli-config-provider';
import { ConfigNames } from '../../../../config/ConfigNames';
import { MetadataProvider } from '@thundra/foresight-cli-metadata-provider';
import { COVERAGE_FORMAT_TYPES } from '../../../../constants';

const getAdditinalInfoForCoverage = () => {
    return {
        apiKey: ConfigProvider.get<string>(ConfigNames.general.apiKey),
        projectId: ConfigProvider.get<string>(ConfigNames.general.projectId),
        format: COVERAGE_FORMAT_TYPES[ConfigProvider.get<string>(ConfigNames.command.coverage.format)]
    }
}

export const preAction = async (command: any) => {
    if (!command) {
        logger.error('<PreAction> Command can not be null');
        return;
    }
    
    await initCoverage(command.opts());
};

export const action = async () => {
    return Upload({
        type: UPLOADER_SIGNED_URL_TYPES.COVERAGE, 
        metadata: MetadataProvider(getAdditinalInfoForCoverage())
    });
}