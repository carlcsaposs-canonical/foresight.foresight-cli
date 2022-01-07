#!/usr/bin/env node

import { Command } from 'commander';
import * as CommandCreater from './commands/upload';
import logger from './logger';

const { version } = require('../package.json');

const program = new Command();
program.version(version);

(async() => {
    program
        .addCommand(CommandCreater.createTestUploadCommand())
  
    await program.parseAsync(process.argv);
})().catch((err: Error) => {
    logger.error(err.message, err);
});

