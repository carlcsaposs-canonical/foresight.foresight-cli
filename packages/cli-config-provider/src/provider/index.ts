export default class ConfigProvider {

    static configMetadata: any

    static configs: any;

    static init(configMetadata: any, options: any): void {
        ConfigProvider.configMetadata = configMetadata;
        ConfigProvider.configs = options;

        Object.keys(process.env).forEach(environmentKey => {
            const configMeta = ConfigProvider.configMetadata[environmentKey];
            if (!ConfigProvider.configs[environmentKey]) {
                ConfigProvider.configs[environmentKey] = process.env[environmentKey] || ( configMeta ? configMeta.default : '');
            }
            
        })

        // Object.keys(ConfigProvider.configMetadata).forEach(configName => {
        //     const env = process.env[configName] || ConfigProvider.configMetadata[configName].default;   
        //     if (env 
        //         && !ConfigProvider.configs[ConfigProvider.configMetadata[configName].key]
        //         && !ConfigProvider.configs[configName]) {
        //         ConfigProvider.configs[configName] = env;
        //     }
        // });
    }

    static get<T>(key: string, defaultValue?: T): T {
        const value: T = ConfigProvider.configs[key] 
            || (ConfigProvider.configMetadata[key] && ConfigProvider.configMetadata[key].key 
                ? ConfigProvider.configs[ConfigProvider.configMetadata[key].key] : undefined);

        if (value != undefined) {
            return value;
        } else if (defaultValue !== undefined) { 
            return defaultValue;
        } else if (ConfigProvider.configMetadata[key]) {
            return ConfigProvider.configMetadata[key].default as T;
        } else {
            return undefined;
        }
    }
}