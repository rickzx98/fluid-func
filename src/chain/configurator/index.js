import { getLogger } from './getLogger';
import { getPlugins } from './getPlugins';
import { setChainConfig } from '../storage/';

export default class Configutrator {
    static configure(props) {
        const config = {};
        getLogger(config, props);
        getPlugins(config, props);
        setChainConfig(config);
    }
}