import * as fs from 'fs';

import * as git from 'isomorphic-git';
import logger from '../../logger';

import { GitEnvironmentInfo } from '../../model/GitEnvironmentInfo';

export let gitEnvironmentInfo: GitEnvironmentInfo;

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

    let repoURL: string;
    let repoName: string;
    let branch: string;
    let commitHash: string;
    let commitMessage: string;

    try {
        logger.debug('<GitHelper> Obtaining git environment information ...');
        
        const gitroot = await git.findRoot({
            fs,
            filepath: process.cwd(),
        });

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
            repoURL,
            repoName,
            branch,
            commitHash,
            commitMessage,
        );

        logger.debug('<GitHelper> Obtained git environment information ...');
    } catch (error) {
        logger.error('<GitHelper> Git environment did not created.', error);
    }

    return gitEnvironmentInfo;
};
