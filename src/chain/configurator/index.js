import { getPlugins as plugins, setChainConfig } from '../storage/';

import { getLogger } from './getLogger';
import { getPlugins } from './getPlugins';

export default class Configutrator {
    static configure(props) {
        const config = {};
        getLogger(config, props);
        getPlugins(config, props, plugins());
        setChainConfig(config);
    }
}