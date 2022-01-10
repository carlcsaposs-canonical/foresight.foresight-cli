import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as util from 'util';
import logger from '../logger';

const mime = require('mime-types');

const readFile = util.promisify(fs.readFile);

export const createFolderUnderTmpSync = (prefix: string): string | undefined => {
    try {
        return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    } catch (error) {
        logger.debug(`<FileUtil> ${prefix} did not created`);
        return null;
    }
};

export const removeFolderSync = (tmpDir: string): void => {
    try {
        fs.rmSync(tmpDir, { recursive: true });
    } catch (error) {
        logger.debug(`<FileUtil> ${tmpDir} did not removed`);
    }
};

export const isExist = (dir: string): boolean => {
    try {
        return fs.existsSync(dir);
    } catch (error) {
        logger.debug(`<FileUtil> An error occured while checking dir: ${dir}`);
        return false;
    }
};

export const getFile = async (fileDir: string): Promise<Buffer | undefined> => {
    try {
        return (await readFile(fileDir));
    } catch (error) {
        logger.debug(`<FileUtil> An error occured reading file: ${fileDir}`);
        return null;
    }
};

export const getMimeType = (filename: string): string | false => {
    return mime.contentType(path.extname(filename));
};