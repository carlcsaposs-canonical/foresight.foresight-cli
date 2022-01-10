/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as http from 'http';
import * as https from 'https';
import * as Url from 'url';

const isContentStringify = (content: any) => {
    return !(content instanceof String 
        || content instanceof Buffer 
        || content instanceof Uint8Array);
};

export interface RequestModel {
    url: string;
    method: string;
    data?: any;
    headers? : any;
    timeout?: number;
}

// const httpAgent = new http.Agent({
//     keepAlive: true,
// });

// const httpsAgent = new https.Agent({
//     maxCachedSessions: 1,
//     keepAlive: true,
// });

export const request = (requestModel: RequestModel): any => {
    const requestUrl = new Url.URL(requestModel.url);
    const useHttps = requestUrl.protocol === 'https:';
    const options = {
        hostname: requestUrl.hostname,
        port: requestUrl.port,
        path: requestUrl.pathname + requestUrl.search,
        method: requestModel.method,
        headers: requestModel.headers || {},
        timeout: requestModel.timeout || 30,
        //agent: useHttps ? httpsAgent : httpAgent,
    };

    return new Promise((resolve, reject) => {
        const request = (useHttps ? https : http).request(options, (response) => {
            let responseData = '';
            response.on('data', (chunk) => {
                responseData += chunk;
            });
            response.on('end', () => {
                resolve(responseData);
            });
        }).on('error', (err) => {
            reject(err);
        });

        const data = requestModel.data;
        if (data) {
            request.write(isContentStringify(data) ? JSON.stringify(data) : data);
        }

        request.end();
    });
};