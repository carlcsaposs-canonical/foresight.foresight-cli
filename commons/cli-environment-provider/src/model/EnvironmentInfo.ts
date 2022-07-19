export default class EnvironmentInfo {

    cliRunId: string;
    environment: string;
    repoURL: string;
    repoName: string;
    branch: string;
    commitHash: string;
    commitMessage: string;
    gitRoot?: string;

    constructor(
        cliRunId: string,
        environment: string,
        repoURL: string,
        repoName: string,
        branch: string,
        commitHash: string,
        commitMessage: string,
        gitRoot?: string,
    ) {
        this.cliRunId = cliRunId;
        this.environment = environment;
        this.repoURL = repoURL;
        this.repoName = repoName;
        this.branch = branch;
        this.commitHash = commitHash;
        this.commitMessage = commitMessage;
        this.gitRoot = gitRoot;
    }

    getRepoFullName(): string {
        /**
         * default behavior
         */
        return this.repoName;
    }
}
