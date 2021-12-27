import BaseOption from './BaseOption';

export default class UploadActionOption extends BaseOption {

    uploadDir: string;

    constructor(uploadDir: string) {
        super();
        this.uploadDir = uploadDir;
    }
}