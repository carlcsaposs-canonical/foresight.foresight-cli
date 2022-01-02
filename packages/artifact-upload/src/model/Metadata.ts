import OwnerInfo from './OwnerInfo';
import SourceInfo from './SourceInfo';

export default class Metadata {

    sourceInfo: SourceInfo;
    ownerInfo: OwnerInfo;
    ciProvider: String;
    workflowRunId: string;
    testFramework: string;
    createdAt: string;

    constructor(
        sourceInfo: SourceInfo,
        ownerInfo: OwnerInfo,
        ciProvider: String,
        workflowRunId: string,
        testFramework: string,
        createdAt: string,
    ){
        this.sourceInfo = sourceInfo;
        this.ownerInfo = ownerInfo;
        this.ciProvider = ciProvider;
        this.workflowRunId = workflowRunId;
        this.testFramework = testFramework;
        this.createdAt = createdAt;
    }
}