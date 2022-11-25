import * as path from 'path';

const normalizePath = require('normalize-path');

export const getExtention = (pathStr: string) => {
    return path.extname(pathStr);
}

export const getAbsolutePath = (candidatePath: string): string => {
    return path.isAbsolute(candidatePath) ? candidatePath : path.join(process.cwd(), candidatePath);
};

export const normalize = (path: string) => {
    return normalizePath(path);
}