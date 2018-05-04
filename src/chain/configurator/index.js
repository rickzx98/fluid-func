import { setChainConfig } from '../storage/';
import { getLogger} from './getLogger';

export default class Configutrator  {
    static configure(props){
        const config = {};
        getLogger(config, props);
        setChainConfig(config);
    }
}