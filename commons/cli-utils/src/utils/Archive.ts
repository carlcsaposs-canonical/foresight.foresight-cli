import * as fs from 'fs';
import { logger } from '@runforesight/foresight-cli-logger';
import * as GlobUtil from './Glob';
import { ArchiveGlobsModel } from '../types';

import * as archiver from 'archiver';

export const zipGlobs = async (archiveGlobsModel: ArchiveGlobsModel) : Promise<string> => {
    let matchedFileCount = 0;
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            archive.destroy(new Error(`Archive process timed out after ${archiveGlobsModel.timeout} ms`));
        }, archiveGlobsModel.timeout);

        const onComplete = (obj?: any) => {
            clearTimeout(timer);
            resolve(obj)
        }

        const onError = (obj?: any) => {
            clearTimeout(timer);
            reject(obj)
        }

        const destinationDir = archiveGlobsModel.destinationDir;

        const output = fs.createWriteStream(destinationDir);
        output.on('close', async () => onComplete(destinationDir));
        output.on('end', async () => onComplete(destinationDir));
        
        const archive = archiver('zip', { zlib: { level: 9 }});

        const attachments = archiveGlobsModel.attachments;
        (attachments || []).forEach(attachment => {
            logger.debug(`<ArchiveUtil> Attachment will be added to archive: ${attachment.filaname}`);
            archive.append(
                Buffer.isBuffer(attachment.content) 
                    ? attachment.content
                    : Buffer.from(attachment.content), 
                    { name: `${attachment.filaname}` });
        });

        archive.on('error', (err: Error) => onError(err));
        archive.on('warning', (err: Error) => {
            if (err) {
                logger.debug(`<ArchiveUtil> ${err.message}`);
                onComplete(err.message);
                return;
            }
           
            onComplete();
        });

        archive.pipe(output);

        const stream = GlobUtil.streamGlobs(
            archiveGlobsModel.globs,
            { absolute: true, deep: archiveGlobsModel.maxDepth, dot: true }
        );
      
        stream.on('data', function (chunk) {
            const fileDir = chunk;
            if ((archiveGlobsModel.filters || []).some(filter => !filter.filter(fileDir))){
                return;
            }

            const zipFilePath = archiveGlobsModel.root 
                ? fileDir.replace(archiveGlobsModel.root, '') 
                : fileDir;

            logger.debug(`<ArchiveUtil> File: ${zipFilePath} will be added to archive.`);

            matchedFileCount += 1;
            archive.file(fileDir, { name: zipFilePath});
        });

        stream.on('end', function () {
            if (matchedFileCount == 0) {
                logger.info('<ArchiveUtil> There is no matched file with given pattern.');
                archive.abort();
            } 

            logger.debug('<ArchiveUtil> Archive will be finalized');
            archive.finalize()
            .then(() => {
                archive.emit('end', '');
            })
            .catch(() => { /** no need any logic already handled by .on('error') handler */ });
        });
      
        stream.on('error', function (err) {
            logger.debug(`<ArchiveUtil> An error occured while reading matched glob path: ${err.message}`);
        });
    })
}