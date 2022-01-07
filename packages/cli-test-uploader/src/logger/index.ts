import ConfigNames from '../config/ConfigNames';
import { UPLOADER_LOG_PREFIX } from '../constats';

const logger = require('npmlog');

logger.addLevel('debug', 2100, { fg: 'green' });
logger.level = process.env[ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL] ?
    process.env[ConfigNames.THUNDRA_UPLOADER_LOG_LEVEL].toLowerCase() : 'error';
logger.disableColor();

export default {
    info: (message: string): void => {
        logger.info(UPLOADER_LOG_PREFIX, message);
    }, 
    debug: (message: string): void => {
        logger.log('debug', UPLOADER_LOG_PREFIX, message);
    },
    error: (message: string, err?: Error): void => {
        logger.error(UPLOADER_LOG_PREFIX, message, err);
    }
};