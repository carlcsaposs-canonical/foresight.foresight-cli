export default class OwnerInfo {

    apiKey: string;
    userAccountId: string;
    projectId: string;
    repoId: string;

    constructor(
        apiKey: string,
        userAccountId: string,
        projectId: string,
        repoId: string,
    ) {
        this.apiKey = apiKey;
        this.userAccountId = userAccountId;
        this.projectId = projectId;
        this.repoId = repoId;
    }
}
