import BaseActionModel from './BaseOptionModel';

export default class UploadActionOption extends BaseActionModel {

    uploadDir: string;

    constructor(uploadDir: string) {
        super();
        this.uploadDir = uploadDir;
    }
}