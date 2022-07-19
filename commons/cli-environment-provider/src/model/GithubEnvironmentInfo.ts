import EnvironmentInfo from "./EnvironmentInfo";

export default class GithubEnvironmentInfo extends EnvironmentInfo {
    static REPO_URL_PREFIX = 'https://github.com/';

    runId: string;
    runAttempt: string;
    runnerName: string;
    jobId?: string;
    jobName?: string;

    constructor(
        cliRunId: string,
        environment: string,
        repoURL: string,
        repoName: string,
        branch: string,
        commitHash: string,
        commitMessage: string,
        runId: string,
        runAttempt: string,
        runnerName: string,
        jobId?: string,
        jobName?: string,
        gitRoot?: string
    ) {
        super(cliRunId, environment, repoURL, repoName, branch, commitHash, commitMessage, gitRoot);

        this.runId = runId;
        this.runAttempt = runAttempt;
        this.jobId = jobId;
        this.jobName = jobName;
        this.runnerName = runnerName;
    }

    getRepoFullName(): string {
        let repoFullName;
        try {
            const splitArr = this.repoURL.
                replace(GithubEnvironmentInfo.REPO_URL_PREFIX, '').split('.');
            repoFullName = splitArr.length == 1 ? splitArr[0] : splitArr.slice(0, -1).join('.');
        } finally {
            return repoFullName || super.getRepoFullName();
        }
    }
}