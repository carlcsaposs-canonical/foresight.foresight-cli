export default class Metadata {

    environment: string;
    repoUrl: string;
    repoName: string;
    repoFullName: string;
    branch: string;
    commitHash: string;
    commitMessage: string;
    apiKey: string;
    projectId: string;
    cliRunId: string;
    testFramework: string;
    createdAt: number;

    constructor(
        environment: string,
        repoUrl: string,
        repoName: string,
        repoFullName: string,
        branch: string,
        commitHash: string,
        commitMessage: string,
        apiKey: string,
        projectId: string,
        cliRunId: string,
        testFramework: string,
        createdAt: number,
    ) {
        this.environment = environment;
        this.repoUrl = repoUrl;
        this.repoName = repoName;
        this.repoFullName = repoFullName;
        this.branch = branch;
        this.commitHash = commitHash;
        this.commitMessage = commitMessage;
        this.apiKey = apiKey;
        this.projectId = projectId;
        this.cliRunId = cliRunId;
        this.testFramework = testFramework;
        this.createdAt = createdAt;
    }
}