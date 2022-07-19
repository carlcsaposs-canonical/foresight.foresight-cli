import * as fg from 'fast-glob';

const isGlob = require('is-glob');

export const isPathGlob = (path: string): boolean => {
    return isGlob(path);
}

export const streamGlobs = (
    globArr: string[], 
    options = {
        dot: true, absolute: true, deep: 5
    }): NodeJS.ReadableStream => {
    return fg.stream(globArr, options);
}