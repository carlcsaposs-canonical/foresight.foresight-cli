import ConfigProvider from "../../config/ConfigProvider";
import * as EnvironmentSupport from '../../environment/EnvironmentSupport';

export const init = async (options: any) => {
    ConfigProvider.init(options);
    await EnvironmentSupport.init();
}