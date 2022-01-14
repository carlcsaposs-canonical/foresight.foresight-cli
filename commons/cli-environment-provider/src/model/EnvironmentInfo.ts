import { GitEnvironmentInfo } from './GitEnvironmentInfo';

export default class EnvironmentInfo extends GitEnvironmentInfo {

    cliRunId: string;
    environment: string;
    repoURL: string;
    repoName: string;
    branch: string;
    commitHash: string;
    commitMessage: string;

    constructor(
        cliRunId: string,
        environment: string,
        repoURL: string,
        repoName: string,
        branch: string,
        commitHash: string,
        commitMessage: string,
    ) {
        super(repoURL, repoName, branch, commitHash, commitMessage);

        this.cliRunId = cliRunId;
        this.environment = environment;
    }
}
