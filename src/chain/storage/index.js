import {
    getChain as gc,
    getChainContext as gcc,
    getChainDataById as gcdbi,
    getLogMonitor as _getLogMonitor
} from './get';
import {
    putChain as pc,
    putChainContext as pcc,
    setChainConfig as _setChainConfig
} from './put';

import {exists} from './exists';
import {generateUUID} from '../Util';
import {CHAIN_CONFIG} from './constants';

if (global && !global.__$fs__) {
    global.__$fs__ = {};
}
else if (window && !window.__$fs__) {
    window.__$fs__ = {};
}

const storage = global.__$fs__ || window.__$fs__;

export function getChain(name) {
    return gc(storage, name);
}

export function getChainContext(chainId, field) {
    return gcc(storage, chainId, field);
}

export function putChain(name, chain) {
    pc(storage, exists, name, chain);
}

export function putChainContext(chainId, field, value) {
    pcc(storage, chainId, field, value);
}

export function getChainDataById(chainId) {
    return gcdbi(storage, chainId);
}

export function createExecutionStack() {
    const stackId = generateUUID();
    storage[stackId] = {
        type: 'execution',
        chains: []
    };
    return stackId;
}

export function addChainToStack(stackId, chainId) {
    storage[stackId].chains.push(chainId);
}

export function cacheChainAction(stackId, chainId, param, result) {
    storage[stackId][chainId] = {};
    storage[stackId][chainId][JSON.stringify(param)] = {
        result,
        timestamp: new Date().getTime()
    };
}

export function hasCached(stackId, chainId, param) {
    return storage[stackId][chainId] && storage[stackId][chainId][JSON.stringify(param)];
}

export function getCachedChainAction(stackId, chainId, param) {
    return storage[stackId][chainId][JSON.stringify(param)];
}

export function clearCache(stackId, chainId) {
    delete storage[stackId][chainId];
}

export function deleteStack(stackId) {
    const stack = storage[stackId];
    stack.chains.forEach(chainId => {
        const chain = storage[chainId];
        for (let field in chain) {
            if (chain.hasOwnProperty(field)) {
                delete chain[field];
            }
        }
        delete storage[chainId];
    });
    delete storage[stackId];
}


export function getStorage() {
    return Object.freeze(storage);
}

export function isExists(name) {
    return exists(storage, name);
}

export function setChainConfig(config) {
    _setChainConfig(CHAIN_CONFIG, storage, config);
}

export function getLogMonitor() {
    return _getLogMonitor(CHAIN_CONFIG, storage);
}