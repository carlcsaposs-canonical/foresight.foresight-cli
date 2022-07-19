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
    format?: string;
    framework?: string;
    projectId?: string;
    runId?: string;
    runAttempt?: string;
    jobId?: string;
    jobName?: string;
    runnerName?: string;
    gitRoot?: string;
    host?: string;
    [propName: string]: any;
}