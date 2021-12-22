import Metadata from '../model/Metadata';
import * as EnvironmentSupport from '../environment/EnvironmentSupport';
import ConfigProvider from '../config/ConfigProvider';
import ConfigNames from '../config/ConfigNames';

export const createMetaData = (): Metadata => {

    /**
     * update metadata according to  
     */

    const apiKey = ConfigProvider.get<string>(ConfigNames.THUNDRA_APIKEY);
    const projectId = ConfigProvider.get<string>(ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID);
    const environmentInfo = EnvironmentSupport.getEnvironmentInfo();

    return new Metadata(
        apiKey,
        projectId,
        environmentInfo);
};