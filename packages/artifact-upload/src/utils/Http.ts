/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as http from 'http';
import * as https from 'https';
import * as Url from 'url';

// const httpAgent = new http.Agent({
//     keepAlive: true,
// });

// const httpsAgent = new https.Agent({
//     maxCachedSessions: 1,
//     keepAlive: true,
// });

export const getHttpModule = (url: any) => {
    if (url.protocol === 'https:') {
        return https;
    }

    return http;
};

export const makeRequest = (url: string, data: any, { headers = {} }: any): any => {
    const requestUrl = new Url.URL(url);
    const useHttps = requestUrl.protocol === 'https:';
    const options = {
        hostname: requestUrl.hostname,
        port: requestUrl.port,
        path: requestUrl.pathname + requestUrl.search,
        method: 'PUT',
        headers,
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

        if (data) {
            request.write(data);
        }

        request.end();
    });
};