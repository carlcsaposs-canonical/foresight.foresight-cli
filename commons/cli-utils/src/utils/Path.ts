import * as path from 'path';

export const getExtention = (pathStr: string) => {
    return path.extname(pathStr);
}

export const getAbsolutePath = (candidatePath: string): string => {
    return path.isAbsolute(candidatePath) ? candidatePath : path.join(process.cwd(), candidatePath);
};