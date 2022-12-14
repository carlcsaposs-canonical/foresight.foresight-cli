import * as DefaultEnvironmentInfoProvider from './default';
import * as GithubEnvironmentInfoProvider from './github';
import * as BitbucketEnvironmentInfoProvider from './bitbucket';
import * as JenkinsEnvironmentInfoProvider from './jenkins';
import * as GitlabEnvironmentInfoProvider from './gitlab';
import * as CircleCIEnvironmentInfoProvider from './circleci';
import * as TravisCIEnvironmentInfoProvider from './travisci';
import { logger } from '@runforesight/foresight-cli-logger';

export const environmentInfoProviders = {
    [DefaultEnvironmentInfoProvider.ENVIRONMENT]: DefaultEnvironmentInfoProvider,
    [GithubEnvironmentInfoProvider.ENVIRONMENT]: GithubEnvironmentInfoProvider,
    [BitbucketEnvironmentInfoProvider.ENVIRONMENT]: BitbucketEnvironmentInfoProvider,
    [JenkinsEnvironmentInfoProvider.ENVIRONMENT]: JenkinsEnvironmentInfoProvider,
    [GitlabEnvironmentInfoProvider.ENVIRONMENT]: GitlabEnvironmentInfoProvider,
    [CircleCIEnvironmentInfoProvider.ENVIRONMENT]: CircleCIEnvironmentInfoProvider,
    [TravisCIEnvironmentInfoProvider.ENVIRONMENT]: TravisCIEnvironmentInfoProvider,
};

/**
 * Initiate all environment providers
 */
export const init = async (): Promise<void> => {
    logger.debug('<EnvironmentProvider> Environments initilizing ...');

    for (const environmentInfoProvider of Object.values(environmentInfoProviders)) {
        await environmentInfoProvider.init();
    }
};
