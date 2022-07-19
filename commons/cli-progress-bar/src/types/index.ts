export interface CliProgressBar {
    start(total: number, start: number): CliProgressBar;
    increment(value: number): void;
    stop(): void;
}