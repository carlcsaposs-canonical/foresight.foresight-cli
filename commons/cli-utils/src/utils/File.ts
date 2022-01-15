import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { logger } from '@thundra/foresight-cli-logger';

const mime = require('mime-types');

export const createFolderUnderTmp = async (prefix: string): Promise<string | undefined> => {
    try {
        return fs.promises.mkdtemp(path.join(os.tmpdir(), prefix));
    } catch (error) {
        logger.debug(`<FileUtil> ${prefix} did not created`);
        return null;
    }
};

export const removeFolder = async (tmpDir: string): Promise<boolean> => {
    try {   
        await fs.promises.rm(tmpDir, { recursive: true });
        return true;
    } catch (error) {
        logger.debug(`<FileUtil> ${tmpDir} did not removed`);
        return false;
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
        return fs.promises.readFile(fileDir);
    } catch (error) {
        logger.debug(`<FileUtil> An error occured reading file: ${fileDir}`);
        return null;
    }
};

export const getFileSizeMB = async (fileDir: string): Promise<number | null> => {
    try {
       const { size } = await getFileStat(fileDir);
       return size / (1024 * 1024)
    } catch (error) {
        logger.debug(`<FileUtil> An error occured reading file size: ${fileDir}`);
        return null;
    }
}

export const getFileStat = async (fileDir: string): Promise<fs.Stats | undefined> => {
    try {
        return (await fs.promises.stat(fileDir));
    } catch (error) {
        logger.debug(`<FileUtil> An error occured reading file stat: ${fileDir}`);
        return null;
    }
}

export const readDir = async (dir: string): Promise<string[]> => {
    try {
        return fs.promises.readdir(dir);
    } catch (error) {
        logger.debug(`<FileUtil> An error occured while reading dir: ${dir}`);
        return [];
    }
}

export const getMimeType = (filename: string): string | false => {
    return mime.contentType(path.extname(filename));
};