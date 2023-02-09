export interface ArchiveFilter {
    filter(str: string): boolean;
}

export type RequestModel = {
    url: string;
    method: string;
    data?: any;
    headers? : any;
    timeout?: number;
    trackProgress?: boolean;
}

export type ArchiveAttachment = {
    content: string | Buffer,
    filaname: string
}

export class ArchiveGlobsModel {
    globs: string[];
    destinationDir: string;
    attachments?: ArchiveAttachment[];
    root?: string;
    maxDepth: number;
    filters?: ArchiveFilter[];
    timeout?: number;

    constructor(
        globs: string[],
        destinationDir: string,
        attachments?: ArchiveAttachment[],
        root?: string,
        maxDepth = 5,
        filters?: ArchiveFilter[],
        timeout = 60000,
    ) {
        this.globs = globs;
        this.destinationDir = destinationDir;
        this.attachments = attachments;
        this.root = root;
        this.maxDepth = maxDepth;
        this.filters = filters;
        this.timeout = timeout;
    }
}