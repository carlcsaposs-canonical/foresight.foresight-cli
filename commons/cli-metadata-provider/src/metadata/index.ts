import { Metadata } from '../types';
import { EnvironmentSupport } from '@runforesight/foresight-cli-environment-provider';
const os = require("os");

const createMetadata = (additinalInfo: { [propName: string]: any }): Metadata => {
    const environmentInfo = EnvironmentSupport.getEnvironmentInfo();

    return {
        ...additinalInfo,
        ...environmentInfo,
        repoFullName: environmentInfo.getRepoFullName(),
        createdAt: Math.floor(Date.now() / 1000) * 1000,
        host: os.hostname()
    } as Metadata;
};

export default createMetadata;
