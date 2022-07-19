#!/usr/bin/env node

import { Command, CommanderError } from "commander";
import { logger } from '@thundra/foresight-cli-logger';
import { ALLOWED_COMMANDER_EXIT_CODES } from './constants';
import * as TestUploader from '@thundra/foresight-cli-test-uploader/src/commands/upload';

const { version } = require('../package.json');

const program = new Command();
program.version(version);
program.exitOverride();
program
    .addCommand(TestUploader.createTestUploadCommand())
    .addCommand(TestUploader.createCoverageUploadCommand());

(async() => {
    await program.parseAsync(process.argv);
})().catch((err: Error) => {
    if (err instanceof CommanderError && ALLOWED_COMMANDER_EXIT_CODES.includes(err.code)) {
        return;
    }
    
    logger.error(`<CLI> ${err.message}`, err);
});

