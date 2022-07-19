export type ConfigSchemaTypes = 'string' | 'number' | 'boolean' | 'map' | 'array';

export type ConfigProviderModel<C extends BaseConfig, K extends BaseConfigMetaData<C | {}>> = {
    config?: C;
    configMetaData?: K;
}

export type BaseConfig = {
    [propName: string]: any;
};

export type BaseConfigMetaData<T extends BaseConfig> = {
    [key: string]: {
        key: keyof T,
        type: ConfigSchemaTypes,
        required?: boolean,
        default?: any,
        flag?: string,
        description?: string,
    };
}