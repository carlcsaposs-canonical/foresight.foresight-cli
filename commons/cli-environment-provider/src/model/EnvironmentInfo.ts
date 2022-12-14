export default class EnvironmentInfo {

    cliRunId: string;
    environment: string;
    repoURL: string;
    repoName: string;
    branch: string;
    commitHash: string;
    commitMessage: string;
    root: string;

    constructor(
        cliRunId: string,
        environment: string,
        repoURL: string,
        repoName: string,
        branch: string,
        commitHash: string,
        commitMessage: string,
        root: string,
    ) {
        this.cliRunId = cliRunId;
        this.environment = environment;
        this.repoURL = repoURL;
        this.repoName = repoName;
        this.branch = branch;
        this.commitHash = commitHash;
        this.commitMessage = commitMessage;
        this.root = root;
    }

    getRepoFullName(): string {
        /**
         * default behavior
         */
        return this.repoName;
    }
}
