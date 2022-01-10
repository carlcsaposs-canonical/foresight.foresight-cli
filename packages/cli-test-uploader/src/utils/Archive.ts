import * as fs from 'fs';
import { UPLOADER_METADATA_FILENAME } from '../constats';
import logger from '../logger';

const archiver = require('archiver');

export const zipFolder = async (
    sourceDir: string,
    destinationDir: string,
    metadata?: string,
) : Promise<string> => {
    
    return new Promise((resolve, reject) => {

        const output = fs.createWriteStream(destinationDir);
        output.on('close', async () => resolve(destinationDir));
        output.on('end', async () => resolve(destinationDir));
        
        const archive = archiver('zip', { zlib: { level: 9 }});

        if (metadata) {
            archive.append(metadata, { name: `${UPLOADER_METADATA_FILENAME}` });
        }

        archive.on('error', (err: Error) => reject(err));
        archive.on('warning', (err: Error) => {
            logger.debug(`<ArchiveUtil> ${err.message}`)
            resolve(err.message);
        });

        archive.pipe(output);
        archive
            .directory(sourceDir, false)
            .finalize();
    });
};