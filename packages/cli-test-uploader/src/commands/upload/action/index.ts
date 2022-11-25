import {
    UrlUtil,
    FileUtil,
    ArchiveUtil,
    HttpUtil,
    GlobUtil,
    UtilType,
    PathUtil,
} from '@runforesight/foresight-cli-utils';
import * as path from 'path';
import { ConfigProvider } from '@runforesight/foresight-cli-config-provider';
import { MetadataType } from '@runforesight/foresight-cli-metadata-provider';
import { ConfigNames } from '../../../config/ConfigNames';
import { 
    UPLOADER_TMP_PREFIX,
    UPLOADER_SIGNER_PATH,
    UPLOADER_SIGNED_URL_TYPES,
    UPLOADER_METADATA_FILENAME,
} from '../../../constants';
import { logger } from '@runforesight/foresight-cli-logger';

export interface UploadRequest {
    type: string,
    metadata: MetadataType.Metadata,
    filters?: UtilType.ArchiveFilter[]
}

const upload = async (uploadRequest: UploadRequest) => {
    /**
     * generate unique file name
     * (runId + time) as uuid ?
     */

    logger.debug('<UploadAction> Upload action working ...');

    const type = uploadRequest.type;
    const uploadType = UPLOADER_SIGNED_URL_TYPES[type];
    if (!uploadType) {
        logger.info(`<UploadAction> Unsupported upload type: ${type}`);
        return;
    }

    const metadata = uploadRequest.metadata;
    const apiKey = metadata.apiKey;
    const filename = FileUtil.generateRandomFileName('.zip');
    const signerUrl = ConfigProvider.get<string>(ConfigNames.signer.url);
    const reportDirs = ConfigProvider.get<string[]>(ConfigNames.uploader.dir);
    if (!reportDirs) {
        logger.info('<UploadAction> There is no avaliable upload dir.');
        return;
    }

    const uploaderMaxSize = ConfigProvider.get<number>(ConfigNames.uploader.maxSize);
    const scanPathMaxDepth = ConfigProvider.get<number>(ConfigNames.archiver.scanPathMaxDepth);
    const archiveProcessTimeout = ConfigProvider.get<number>(ConfigNames.archiver.processTimeout);
    const forceStreamToEnd = ConfigProvider.get<boolean>(ConfigNames.archiver.forceStreamToEnd);
    const uploadProcessTimeout = ConfigProvider.get<number>(ConfigNames.uploader.processTimeout);
    const uploadTrackProgress = ConfigProvider.get<boolean>(ConfigNames.uploader.trackProgress);

    /**
     * '/' for foldering on s3
     */
    const fileKey = `${apiKey}/${filename}`;
    let destinationDir;
    try {
        /**
         * Create folder under /tmp
         */
        destinationDir = await FileUtil.createFolderUnderTmp(UPLOADER_TMP_PREFIX);
        logger.debug(`<UploadAction> Tmp folder created under ${destinationDir}`);

        let globs = reportDirs;
        if (reportDirs.length == 1) {
            const reportDir = reportDirs[0];
            if (!GlobUtil.isPathGlob(reportDir)
                && FileUtil.isDirectory(reportDir)) {
                /**
                 * if there is only one path and it is not in glob formated, 
                 * it is a relative path directory
                 * append wild card for upload given directory
                 */
                globs[0] = path.join(globs[0], '**');
            }
        }
        
        /**
         * Create archive with files which are matched with globs
         */
        let archivedFileDir = await ArchiveUtil.zipGlobs(new UtilType.ArchiveGlobsModel(
            globs,
            path.join(destinationDir, filename),
            [{
                content: JSON.stringify(metadata),
                filaname: UPLOADER_METADATA_FILENAME
            }],
            PathUtil.normalize(metadata.gitRoot),
            scanPathMaxDepth,
            uploadRequest.filters,
            archiveProcessTimeout,
            forceStreamToEnd,
        ))
        .catch((err: any) => {
            logger.debug(`<UploadAction> ${err.message}`)
        });

        if (!archivedFileDir) {
            logger.error('<UploadAction> Files did not archived');
            return;
        }

        logger.debug(`<UploadAction> Files archived to ${archivedFileDir}`);

        /**
         * Check archived size is valid
         */
        const archivedFileSize = await FileUtil.getFileSize(archivedFileDir);
        const archivedFileSizeInMb = FileUtil.convertFileSizeMB(archivedFileSize);
        if (archivedFileSizeInMb > uploaderMaxSize) {
            logger.error(`<UploadAction> File size could not be greater than Foresight UPLOADER SIZE_MAX value: ${uploaderMaxSize}`);
            return;
        } else if (archivedFileSizeInMb == 0) {
            logger.error(`<UploadAction> Archived file size is zero: ${archivedFileDir}`);
            return;
        }

        /**
         * Try to get upload signed url according to mine type
         */
        const mimeType = FileUtil.getMimeType(archivedFileDir);
        const presignedS3Url = await HttpUtil.request({
            url: UrlUtil.getJoinedUrl(signerUrl, UPLOADER_SIGNER_PATH),
            method: 'POST',
            data: {
                type: uploadType,
                key: fileKey,
                contentType: mimeType
            },
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                "authorization": `ApiKey ${apiKey}`
            }
        }).catch((err: any) => { 
            logger.error('<UploadAction> An error occured while obtaining signer url');
            logger.debug(`UploadAction ${err.message}`)
        });

        if (!presignedS3Url) {
            logger.error('<UploadAction> Signed url did not created');
            return;
        }

        logger.debug('<UploadAction> Signed url created successfully');

        let uploadUrl; 
        try {
            uploadUrl = JSON.parse(presignedS3Url).url;
        } catch (error) {
            logger.error(`<UploadAction> Signed url did not created.`);
            logger.debug(`${error.message}`)
            return;
        }

        if(!uploadUrl) {
            logger.info('<UploadAction> Signed url can not be empty.');
            return;
        }

        /**
         * Upload archived zip file to signed url
         */
        await HttpUtil.request({
            url: uploadUrl,
            method: 'PUT',
            data: FileUtil.createReadStream(archivedFileDir),
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': archivedFileSize
            },
            timeout: uploadProcessTimeout,
            trackProgress: (
                uploadTrackProgress 
                && logger.canLog('info')
                && archivedFileSize > 65536)
        }).then(() => {
            logger.debug('<UploadAction> Files uploaded');

            return console.log(JSON.stringify({
                status: 'Ok',
                message: `Successfully uploaded all files under ${reportDirs}`,
            }));
        }).catch((err: any) => {
            logger.error(`<UploadAction> An error occured while uploading process`);
            logger.debug(`<UploadAction> ${err.message}`)
        });
    } finally {
        if (destinationDir) {
            /**
             * Remove created folder under '/tmp'
             */
            const removeResult = FileUtil.removeFolder(destinationDir);
            if (removeResult) {
                logger.debug(`<UploadAction> Tmp folder: ${destinationDir} deleted`);
            }
        }
    }
};

export default upload; 
