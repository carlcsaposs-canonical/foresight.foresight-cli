#!/usr/bin/env node

import { Command } from "commander";
import logger from './logger';

const { version } = require('../package.json');

const program = new Command();
program.version(version);

(async() => {
    program.command('upload', 'update installed packages', { 
        executableFile: require.resolve('@thundra-foresight/cli-test-uploader') 
    });;
    
    await program.parseAsync(process.argv);
})().catch((err: Error) => {
    logger.error(err.message, err);
});

