import Metadata from '../model/Metadata';
import { EnvironmentSupport } from '@thundra-foresight/cli-environment-provider';
import { ConfigProvider } from '@thundra-foresight/cli-config-provider';
import ConfigNames from '../config/ConfigNames';

export const createMetaData = (): Metadata => {

    const apiKey = ConfigProvider.get<string>(ConfigNames.THUNDRA_APIKEY);
    const projectId = ConfigProvider.get<string>(ConfigNames.THUNDRA_AGENT_TEST_PROJECT_ID);
    const framework = ConfigProvider.get<string>(ConfigNames.THUNDRA_UPLOADER_FRAMEWORK);
    const environmentInfo = EnvironmentSupport.getEnvironmentInfo();

    return new Metadata(
        environmentInfo.environment,
        environmentInfo.repoURL,
        environmentInfo.repoName,
        environmentInfo.repoName,
        environmentInfo.branch,
        environmentInfo.commitHash,
        environmentInfo.commitMessage,
        apiKey,
        projectId,
        environmentInfo.testRunId,
        framework,
        Math.floor(new Date().getTime() / 1000));
};