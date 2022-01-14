import { CLI_LOG_LEVEL_ENV_VARIABLE_NAME } from '../constants';

const logger = require('npmlog');

logger.addLevel('debug', 2100, { fg: 'green' });
logger.level = process.env[CLI_LOG_LEVEL_ENV_VARIABLE_NAME] ?
    process.env[CLI_LOG_LEVEL_ENV_VARIABLE_NAME].toLowerCase() : 'error';
logger.disableColor();

export default {
    info: (message: string): void => {
        logger.info('', message);
    }, 
    debug: (message: string): void => {
        logger.log('debug', '', message);
    },
    error: (message: string, err?: Error): void => {
        logger.error('', message, err);
    }
};