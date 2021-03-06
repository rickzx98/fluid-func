import { CHAIN_CONFIG } from "./constants";
import { generateUUID } from '../Util';

const GET_CHAIN_METHOD = 'GET_CHAIN_PLUGIN';
const GET_CHAIN_CONTEXT_METHOD = 'GET_CHAIN_CONTEXT_PLUGIN';
const GET_CHAIN_CONFIG_LOG_MONITOR = 'logMonitor';
const GET_CHAIN_CONFIG_PLUGINS = 'plugins';


/**
 * Gets the chain instance from storage
 * @param storage
 * @param name
 */
export function getChain(storage, name) {
    if (storage[GET_CHAIN_METHOD]) {
        return storage[GET_CHAIN_METHOD](name);
    }
    const chain = Object.assign({}, storage[name]);
    chain['$chainId'] = generateUUID();
    return Object.assign({}, chain);
}

/**
 * Gets the chain data from storage by chain id
 * @param storage
 * @param chainId
 */
export function getChainDataById(storage, chainId) {
    if (storage[GET_CHAIN_METHOD]) {
        return storage[GET_CHAIN_METHOD](chainId);
    }
    return storage[chainId];
}

/**
 *  Gets the chain context value from storage
 * @param storage
 * @param chainId
 * @param field
 * @returns {*}
 */
export function getChainContext(storage, chainId, field) {
    if (storage[GET_CHAIN_CONTEXT_METHOD]) {
        return storage[GET_CHAIN_CONTEXT_METHOD](chainId, field);
    }
    if (storage[chainId]) {
        return storage[chainId][field];
    }
}

/**
 * Overrides getChainContext method
 * @param storage
 * @param plugin
 */
export function setGetChainContextPlugin(storage, plugin) {
    if (!(plugin instanceof Function)) {
        throw new GetChainTypeException();
    } else {
        storage[GET_CHAIN_CONTEXT_METHOD] = plugin;
    }
}

/**
 * Overrides getChain method
 * @param storage
 * @param plugin
 */
export function setGetChainPlugin(storage, plugin) {
    if (!(plugin instanceof Function)) {
        throw new GetChainTypeException();
    } else {
        storage[GET_CHAIN_METHOD] = plugin;
    }
}

class GetChainTypeException extends Error {
    constructor() {
        super('Get chain plugin must be a function.');
    }
}

export const getLogMonitor = (chainConfig, storage) => {
    return storage[chainConfig] && storage[chainConfig][GET_CHAIN_CONFIG_LOG_MONITOR] ? storage[chainConfig][GET_CHAIN_CONFIG_LOG_MONITOR] : () => false;
};

export const getPlugins = (chainConfig, storage) => {
    return storage[chainConfig] && storage[chainConfig][GET_CHAIN_CONFIG_PLUGINS] ? storage[chainConfig][GET_CHAIN_CONFIG_PLUGINS] : undefined;
};

