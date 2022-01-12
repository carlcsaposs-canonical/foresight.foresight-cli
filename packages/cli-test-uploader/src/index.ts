#!/usr/bin/env node

import { Command } from 'commander';
import * as CommandCreater from './commands/upload';
import { logger } from '@thundra/foresight-cli-logger';

const { version } = require('../package.json');

const program = new Command();
program.version(version);

(async() => {
    program
        .addCommand(CommandCreater.createTestUploadCommand())
  
    await program.parseAsync(process.argv);
})().catch((err: Error) => {
    logger.error(`<CLITestUploader> ${err.message}`, err);
});

