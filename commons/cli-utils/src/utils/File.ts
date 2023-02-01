import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as PathUtil from './Path';
import * as UuidUtil from './Uuid';
import { logger } from '@runforesight/foresight-cli-logger';

const mime = require('mime-types');

export const generateRandomFileName = (extention = ''): string => {
    return `artifact-${UuidUtil.generateShortId()}${extention}`;
};

export const createFolderUnderTmp = async (prefix: string): Promise<string | undefined> => {
    try {
        return fs.promises.mkdtemp(path.join(os.tmpdir(), prefix));
    } catch (error) {
        logger.debug(`<FileUtil> ${prefix} folder could not be created in the temp folder: ${error}`);
        return null;
    }
};

export const removeFolder = (tmpDir: string): boolean => {
    try {   
        fs.rmdirSync(tmpDir, { recursive: true });
        return true;
    } catch (error) {
        logger.debug(`<FileUtil> ${tmpDir} folder could not be removed: ${error}`);
        return false;
    }
};

export const isExist = (dir: string): boolean => {
    try {
        return fs.existsSync(dir);
    } catch (error) {
        logger.debug(`<FileUtil> An error occured while checking directory '${dir}': ${error}`);
        return false;
    }
};

export const getFile = async (fileDir: string): Promise<Buffer | undefined> => {
    try {
        return fs.promises.readFile(fileDir);
    } catch (error) {
        logger.debug(`<FileUtil> An error occured while reading file '${fileDir}': ${error}`);
        return null;
    }
};

export const createReadStream = (fileDir: string): fs.ReadStream => {
    try {
        return fs.createReadStream(fileDir);
    } catch (error) {
        logger.debug(`<FileUtil> An error occured while creating read stream for file '${fileDir}': ${error}`);
        return null;
    }
};

export const convertFileSizeMB = (size: number): number => {
    return size / (1024 * 1024)
}

export const getFileSize = async (fileDir: string): Promise<number | null> => {
    try {
       const file = await getFile(fileDir);
       if (file) {
           const { size } = await getFileStat(fileDir);
           return size
       } else {
           logger.debug(`<FileUtil> Couldn't find file '${fileDir}'`);
           return 0
       }
    } catch (error) {
        logger.debug(`<FileUtil> An error occured while reading size of the file '${fileDir}': ${error}`);
        return null;
    }
}

export const isFile = (fileDir: string): boolean => {
    const stat = getFileStat(fileDir);
    return stat ? stat.isFile() : false;
}

export const isDirectory = (fileDir: string): boolean => {
    const stat = getFileStat(fileDir);
    return stat ? stat.isDirectory() : false;
}

export const getFileStat = (fileDir: string): fs.Stats | undefined => {
    try {
        return fs.statSync(fileDir);
    } catch (error) {
        logger.debug(`<FileUtil> An error occured while reading stat of the file '${fileDir}': ${error}`);
        return null;
    }
}

export const readDir = async (dir: string): Promise<string[]> => {
    try {
        return fs.promises.readdir(dir);
    } catch (error) {
        logger.debug(`<FileUtil> An error occured while reading directory '${dir}': ${error}`);
        return [];
    }
}

export const getMimeType = (filename: string): string | false => {
    return mime.contentType(PathUtil.getExtention(filename));
};