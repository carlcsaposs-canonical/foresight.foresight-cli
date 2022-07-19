
import { logger } from '@runforesight/foresight-cli-logger';
import {
    StringUtil,
    UtilType,
} from '@runforesight/foresight-cli-utils';
import { 
    UPLOADER_SIGNED_URL_TYPES,
    ALLOWED_TEST_FILE_EXTENTIONS,
} from '../../../../constants';
import { initTest } from '../../../../init/test';
import Upload from '../';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { ConfigNames } from '../../../../config/ConfigNames';
import { MetadataProvider } from '@runforesight/foresight-cli-metadata-provider';
import { TEST_FORMAT_TYPES } from '../../../../constants';

const TestFileFilters: UtilType.ArchiveFilter[] = [
    {
        filter: (str: string) => {
            return ALLOWED_TEST_FILE_EXTENTIONS.some(allowedExtention => StringUtil.endsWith(str, allowedExtention));
        }
    }
]

const getAdditinalInfoForTest = () => {
    return {
        apiKey: ConfigProvider.get<string>(ConfigNames.general.apiKey),
        projectId: ConfigProvider.get<string>(ConfigNames.general.projectId),
        framework: ConfigProvider.get<string>(ConfigNames.command.test.framework),
        format: TEST_FORMAT_TYPES[ConfigProvider.get<string>(ConfigNames.command.test.format)]
    }
}

export const preAction = async (command: any) => {
    if (!command) {
        logger.error('<PreAction> Command can not be null');
        return;
    }
    
    await initTest(command.opts());
};

export const action = async () => {
    return Upload({
        type: UPLOADER_SIGNED_URL_TYPES.TEST, 
        metadata: MetadataProvider(getAdditinalInfoForTest()),
        filters: TestFileFilters
    });
}