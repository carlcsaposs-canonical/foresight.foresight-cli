import * as fs from 'fs';

import * as git from 'isomorphic-git';
import { logger } from '@runforesight/foresight-cli-logger';
import * as CliRunUtils from '../../utils/CliRunUtils';
import { ENVIRONMENT_VARIABLE_NAMES } from '../../constants';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';

import { GitEnvironmentInfo } from '../../model/GitEnvironmentInfo';

export const ENVIRONMENT = 'Git';

export let gitEnvironmentInfo: GitEnvironmentInfo;

export const getCliRunId = (repoURL: string, commitHash: string) => {
    const cliRunId = ConfigProvider.getEnv(ENVIRONMENT_VARIABLE_NAMES.FORESIGHT_CLI_RUN_ID);
    if (cliRunId) {
        return cliRunId;
    }

    return CliRunUtils.getDefaultCliRunId(ENVIRONMENT, repoURL, commitHash);
};

/**
 * Extract repo name
 * @param repoURL repoURL
 */
export const extractRepoName = (repoURL: string): string => {
    if (repoURL == null) {
        return null;
    }
    const idx = repoURL.lastIndexOf('/');
    if (idx >= 0) {
        return normalizeRepoName(repoURL.substring(idx + 1));
    } else {
        return normalizeRepoName(repoURL);
    }
};

const normalizeRepoName = (repoName: string) => {
    if (repoName == null) {
        return null;
    }
    const idx = repoName.indexOf('.');
    if (idx >= 0) {
        repoName = repoName.substring(0, idx);
    }
    return repoName;
};

/**
 * Initiate project Git information
 */
export const init = async (): Promise<GitEnvironmentInfo> => {
    if (gitEnvironmentInfo) {
        return gitEnvironmentInfo;
    }

    let repoURL: string;
    let repoName: string;
    let branch: string;
    let commitHash: string;
    let commitMessage: string;

    try {
        logger.debug('<GitHelper> Obtaining git environment information ...');
        let gitroot;
        try {
            gitroot = await git.findRoot({
                fs,
                filepath: process.cwd(),
            });
        } catch (error) {
            logger.error(`<GitHelper> Git environment couldn't find git file path!`);
            logger.debug(`<GitHelper> Error message according to git file exception: ${error.message}`);
        }

        if (!gitroot) {
            return;
        }

        commitHash = await git.resolveRef({ fs, dir: gitroot, ref: 'HEAD' });

        const [
            REPOURL,
            COMMITOBJECT,
            BRANCHNAME,
        ] = await Promise.all([
            git.getConfig({
                fs,
                dir: gitroot,
                path: 'remote.origin.url',
            }),
            git.readCommit({ fs, dir: gitroot, oid: commitHash }),
            git.currentBranch({
                fs,
                dir: gitroot,
                fullname: false,
            }),
        ]);

        repoURL = REPOURL;
        repoName = REPOURL ? REPOURL.split('/').pop().split('.').shift() : '';
        branch = BRANCHNAME ? BRANCHNAME : '';
        commitMessage = COMMITOBJECT && COMMITOBJECT.commit ? COMMITOBJECT.commit.message : '';

        gitEnvironmentInfo = new GitEnvironmentInfo(
            getCliRunId(repoURL, commitHash),
            ENVIRONMENT,
            repoURL,
            repoName,
            branch,
            commitHash,
            commitMessage,
            gitroot,
        );

        logger.debug('<GitHelper> Obtained git environment information');
    } catch (error) {
        logger.error(`<GitHelper> Git environment did not created: ${error.message}`);
    }

    return gitEnvironmentInfo;
};
