import * as http from 'http';
import * as https from 'https';
import * as Url from 'url';
import * as TypeUtil from './Type';
import * as StreamUtil from './Stream';
import { RequestModel } from '../types';
import { logger } from '@runforesight/foresight-cli-logger';
import { DefaultCliProgessBar, CliProgessBarType } from '@runforesight/foresight-cli-progress-bar';

export const request = (requestModel: RequestModel): any => {
    const requestUrl = new Url.URL(requestModel.url);
    const useHttps = requestUrl.protocol === 'https:';
    const options = {
        hostname: requestUrl.hostname,
        port: requestUrl.port,
        path: requestUrl.pathname + requestUrl.search,
        method: requestModel.method,
        headers: requestModel.headers || {},
        timeout: requestModel.timeout || 30 * 1000,
    };

    return new Promise((resolve, reject) => {
        let timedOut = false;
        const timer = setTimeout(() => {
            timedOut = true;
            if (StreamUtil.isStream(data) && !data.closed) {
                data.close();
            }

            request.destroy(new Error(`Http request process timed out after ${options.timeout} ms`));
        }, options.timeout);

        const request = (useHttps ? https : http).request(options, (response) => {
            let responseData = '';
            response.on('data', (chunk) => {
                responseData += chunk;
            });
            response.on('end', () => onComplete(responseData));
        }).on('error', (err) => onError(err));

        let progressBar: CliProgessBarType.CliProgressBar;
        if (requestModel.trackProgress) {
            progressBar = new DefaultCliProgessBar();
        }

        const clear = () => {
            clearTimeout(timer);
            if (progressBar) {
                progressBar.stop();
            }
        }

        const onComplete = (obj: any) => {
            clear();
            resolve(obj);
        }

        const onError = (obj: any) => {
            clear();
            reject(obj)
        }

        const data = requestModel.data;
        if (data) {
            if (StreamUtil.isStream(data) && data.pipe != undefined) {
                const contentLength = requestModel.headers['Content-Length'];
                if (contentLength && progressBar) {
                    progressBar.start(contentLength, 0);
                }

                StreamUtil.pipeStream(data, request, progressBar)
                .then(() => {
                    logger.debug('<HttpUtil> Stream pipe completed.')
                }).catch((err) => {
                    if (!timedOut) {
                        if (!data.closed) {
                            data.close();
                        }
                
                        request.destroy(err);
                    }
                });

                /**
                 * use built-in pipe method if any bugs on custom impl
                 * 
                 * data.pipe(request, { end: false });
                 * data.on('end', () => {
                 *      request.end()
                 * });
                 * data.on('error', (err: any) => {
                 *      data.close();
                 *      request.destroy(err);
                 * });
                 */
            } else {
                request.write(TypeUtil.isContentStringify(data) ? JSON.stringify(data) : data);
                request.end();
            }
        }
    });
};