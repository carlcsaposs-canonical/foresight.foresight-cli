const urljoin = require('url-join');

export const getJoinedUrl = (url: string, path: string): string => {
    return urljoin(url, path);
};