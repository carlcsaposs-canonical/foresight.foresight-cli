import Metadata from '../model/Metadata';
import * as EnvironmentSupport from '../environment/EnvironmentSupport';
import ConfigProvider from '../config/ConfigProvider';
import ConfigNames from '../config/ConfigNames';
import SourceInfo from '../model/SourceInfo';
import OwnerInfo from '../model/OwnerInfo';
import { CI_PROVIDER_TYPES } from '../constats';

export const createMetaData = (): Metadata => {

    /**
     * update metadata according to  
     */

    const apiKey = ConfigProvider.get<string>(ConfigNames.THUNDRA_APIKEY);
    const projectId = ConfigProvider.get<string>(ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID);
    const framework = ConfigProvider.get<string>(ConfigNames.THUNDRA_UPLOADER_FRAMEWORK);
    const environmentInfo = EnvironmentSupport.getEnvironmentInfo();
    const ciProvider = CI_PROVIDER_TYPES[environmentInfo.environment.toUpperCase()] || 'unknown_provider'; 

    return new Metadata(
        new SourceInfo(
            environmentInfo.environment,
            environmentInfo.repoURL,
            environmentInfo.repoName,
            environmentInfo.repoName,
            environmentInfo.branch,
            environmentInfo.commitHash,
            environmentInfo.commitMessage,
        ),
        new OwnerInfo(
            apiKey,
            'cli',
            projectId,
            'cli'
        ),
        ciProvider,
        environmentInfo.testRunId,
        framework,
        Math.floor(new Date().getTime() / 1000).toString());
};