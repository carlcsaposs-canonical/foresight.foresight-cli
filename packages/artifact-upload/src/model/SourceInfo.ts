export default class SourceInfo {

    environment: string;
    repoURL: string;
    repoName: string;
    repoFullName: string;
    branch: string;
    commitHash: string;
    commitMessage: string;

    constructor(
        environment: string,
        repoURL: string,
        repoName: string,
        repoFullName: string,
        branch: string,
        commitHash: string,
        commitMessage: string,
    ) {
        this.environment = environment;
        this.repoURL = repoURL;
        this.repoName = repoName;
        this.repoFullName = repoFullName;
        this.branch = branch;
        this.commitHash = commitHash;
        this.commitMessage = commitMessage;
    }
}
