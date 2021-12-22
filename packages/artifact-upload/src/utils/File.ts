import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const createFolderUnderTmpSync = (prefix: string): string | undefined => {
    try {
        return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    } catch (error) {
        // log
        return null;
    }
};

export const removeFolderSync = (tmpDir: string): void => {
    try {
        fs.rmSync(tmpDir, { recursive: true });
    } catch (error) {
        // log
    }
};