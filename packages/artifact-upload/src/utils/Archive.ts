import * as archiver from 'archiver';
import * as fs from 'fs';
import { UPLOADER_TMP_PREFIX } from '../constats';

export const zipFolder = async (
    sourceDir: string,
    destinationDir: string,
    metadata?: string,
) : Promise<any> => {
    
    return new Promise((resolve, reject) => {

        const output = fs.createWriteStream(destinationDir);
        output.on('close', async () => resolve({ destinationDir }));
        output.on('end', async () => resolve({ destinationDir }));
        
        const archive = archiver('zip', { zlib: { level: 9 }});

        if (metadata) {
            archive.append(metadata, { name: `${UPLOADER_TMP_PREFIX}.json` });
        }

        archive.on('error', (err: Error) => reject(err));
        archive.on('warning', (err: Error) => {
            // log
            resolve({
                destinationDir,
                err,
            });
        });

        archive.pipe(output);
        archive
            .directory(sourceDir, false)
            .finalize();
    });
};