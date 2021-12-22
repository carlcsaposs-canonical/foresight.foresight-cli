/* eslint-disable */
import ConfigMetadata from './ConfigMetadata';

export default class ConfigProvider {

    static configs: any;

    static init(options: any): void{
        ConfigProvider.configs = options;
    }

    static get<T>(key: string, defaultValue?: T): T {
        const value: T = ConfigProvider.configs[key] 
            || (ConfigMetadata[key] && ConfigMetadata[key].key 
                ? ConfigProvider.configs[ConfigMetadata[key].key] : undefined);

        if (value != undefined) {
            return value;
        } else if (defaultValue !== undefined) { 
            return defaultValue;
        } else if (ConfigMetadata[key]) {
            return ConfigMetadata[key].default as T;
        } else {
            return undefined;
        }
    }
}