import EnvironmentInfo from './EnvironmentInfo';

export default class Metadata {

    apiKey: string;
    projectId: string;
    // workflow info ?
    environmentInfo: EnvironmentInfo;

    constructor(
        apiKey: string,
        projectId: string,
        environmentInfo: EnvironmentInfo){
        this.apiKey = apiKey;
        this.projectId = projectId;
        this.environmentInfo = environmentInfo;
    }
}