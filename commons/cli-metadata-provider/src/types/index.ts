export type Metadata = {
    apiKey: string;
    cliRunId: string;
    environment: string;
    repoURL: string;
    repoName: string;
    repoFullName: string;
    branch: string;
    commitHash: string;
    commitMessage: string;
    createdAt: number;
    root: string;
    format?: string;
    framework?: string;
    projectId?: string;
    workflowName?: string;
    pullRequestNumber?: number;
    runId?: string;
    runAttempt?: string;
    jobId?: string;
    jobName?: string;
    runnerName?: string;
    host?: string;
    userTags?: { [key: string]: any },
    [propName: string]: any;
}