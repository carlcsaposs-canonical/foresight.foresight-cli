import { v4 as uuidv4 } from 'uuid';
import { v5 as uuidv5 } from 'uuid';
import { UPLOADER_UUID_CONST } from '../constats';
import * as path from 'path';
const urljoin = require('url-join');

export const generateId = (): string => {
    return uuidv4();
};

export const generareIdFrom = (value: string): string => {
    return uuidv5(value, UPLOADER_UUID_CONST);
};

export const generateShortId = (): string => {
    return generateId().substring(0, 8);
};

export const generateRandomFileName = (extention = ''): string => {
    return `artifact-${generateShortId()}${extention}`;
};

export const getAbsolutePath = (relativePath: string): string => {
    return path.join(process.cwd(), relativePath);
};

export const getJoinedUrl = (url: string, path: string): string => {
    return urljoin(url, path);
};