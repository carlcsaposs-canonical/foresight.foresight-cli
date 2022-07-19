import EnvironmentInfo from "./EnvironmentInfo";

export class GitEnvironmentInfo extends EnvironmentInfo {
    static REPO_URL_PREFIX = 'git@github.com:';

    constructor(
        cliRunId: string,
        environment: string,
        repoURL: string,
        repoName: string,
        branch: string,
        commitHash: string,
        commitMessage: string,
        gitRoot?: string
    ) {   
        super(cliRunId, environment, repoURL, repoName, branch, commitHash, commitMessage, gitRoot)
    }

    getRepoFullName(): string {
        let repoFullName;
        try {
            const splitArr = this.repoURL.
                replace(GitEnvironmentInfo.REPO_URL_PREFIX, '').split('.');
            repoFullName = splitArr.length == 1 ? splitArr[0] : splitArr.slice(0, -1).join('.');
        } finally {
            return repoFullName || super.getRepoFullName();
        }
    }
}
