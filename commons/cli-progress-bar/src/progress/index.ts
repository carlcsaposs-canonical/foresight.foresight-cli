import { CliProgressBar } from "../types";

const cliProgress = require('cli-progress');

export default class DefaultProgressBar implements CliProgressBar {
    protected bar: any;

    constructor(
        options = {
            stopOnComplete: true,
            gracefulExit: true
        }, 
        type = cliProgress.Presets.shades_classic
    ) {
        this.bar = new cliProgress.SingleBar(options, type);
    }

    start(total: number, start: number): CliProgressBar {
        this.bar.start(total, start);
        return this;
    }

    increment(value: number): void {
        this.bar.increment(value);
    }
    
    stop(): void {
        this.bar.stop()
    }
}