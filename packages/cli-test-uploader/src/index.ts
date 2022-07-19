#!/usr/bin/env node

import { Command, CommanderError } from 'commander';
import * as CommandCreater from './commands/upload';
import { ALLOWED_COMMANDER_EXIT_CODES } from './constants';
import { logger } from '@thundra/foresight-cli-logger';

const { version } = require('../package.json');

const program = new Command();
program.version(version);
program.exitOverride();
program
    .addCommand(CommandCreater.createTestUploadCommand())
    .addCommand(CommandCreater.createCoverageUploadCommand());

(async() => {
    await program.parseAsync(process.argv);
})().catch((err: Error) => {
    if (err instanceof CommanderError && ALLOWED_COMMANDER_EXIT_CODES.includes(err.code)) {
        return;
    }
    
    logger.error(`<CLI> ${err.message}`, err);
});

