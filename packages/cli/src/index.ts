#!/usr/bin/env node

import { Command } from "commander";
import { logger } from '@thundra/foresight-cli-logger';
import * as TestUploader from '@thundra/foresight-cli-test-uploader/dist/commands/upload'

const { version } = require('../package.json');

const program = new Command();
program.version(version);

(async() => {
    program
        .addCommand(TestUploader.createTestUploadCommand());
    
    await program.parseAsync(process.argv);
})().catch((err: Error) => {
    logger.error(`<CLI> ${err.message}`, err);
});

