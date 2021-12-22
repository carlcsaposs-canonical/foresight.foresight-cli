/* eslint-disable */
import ConfigMetadata from './ConfigMetadata';

export default class ConfigProvider {

    static configs: any;

    static init(options: any): void{
        ConfigProvider.configs = options;
    }

    static get<T>(key: string, defaultValue?: T): T {
        const value: T = ConfigProvider.configs[key];
        // tslint:disable-next-line:triple-equals
        if (value != undefined) { // if not null or undefined
            return value;
        } else if (defaultValue !== undefined) { // if user passes null as defaultValue, return null
            return defaultValue;
        } else if (ConfigMetadata[key]) {
            return ConfigMetadata[key].default as T;
        } else {
            return undefined;
        }
    }
}