import * as util from 'util';
import * as stream from 'stream';
import { once } from 'events';
import * as IsStream from 'is-stream';
import { CliProgessBarType } from '@thundra/foresight-cli-progress-bar';

export const isStream = (content: unknown): boolean => {
    return IsStream(content);
}

export const pipeStream = async (
    readable: stream.Readable,
    writable: stream.Writable,
    progressBar?: CliProgessBarType.CliProgressBar) => {
    const finished = util.promisify(stream.finished);
    for await (const chunk of readable) {
        if (progressBar) {
            progressBar.increment(chunk.length);
        }

        if (!writable.write(chunk)) {
            await once(writable, 'drain');
        }
    }

    writable.end();
    await finished(writable).then(() => {
        if (progressBar) {
            progressBar.stop();
        }
    });
}