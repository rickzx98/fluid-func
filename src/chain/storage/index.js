import {
    getLogMonitor as _getLogMonitor,
    getPlugins as _getPlugins,
    getChain as gc,
    getChainContext as gcc,
    getChainDataById as gcdbi
} from './get';
import {
    setChainConfig as _setChainConfig,
    putChain as pc,
    putChainContext as pcc
} from './put';

import { CHAIN_CONFIG } from './constants';
import { exists } from './exists';
import { generateUUID } from '../Util';

const STORE_ID = generateUUID();
const defaultStorage = {
    __$store: (id) => []
};

if (global && !global.__$fs__) {
    global.__$fs__ = defaultStorage;
}
else if (window && !window.__$fs__) {
    window.__$fs__ = defaultStorage;
}

const storage = global.__$fs__ || window.__$fs__;

export function getChain(name) {
    return gc(getData(), name);
}

export function getChainContext(chainId, field) {
    return gcc(getData(), chainId, field);
}

export function putChain(name, chain) {
    const data = getData();
    pc(data, exists, name, chain);
    setData(data);
}

export function putChainContext(chainId, field, value) {
    const data = getData();
    pcc(data, chainId, field, value);
    setData(data);
}

export function getChainDataById(chainId) {
    return gcdbi(getData(), chainId);
}

export function createExecutionStack() {
    const data = getData();
    const stackId = generateUUID();
    data[stackId] = {
        type: 'execution',
        chains: []
    };
    setData(data);
    return stackId;
}

export function addChainToStack(stackId, chainId) {
    const data = getData();
    data[stackId].chains.push(chainId);
    setData(data);
}

export function cacheChainAction(stackId, chainId, param, result) {
    const data = getData();
    data[stackId][chainId] = {};
    data[stackId][chainId][JSON.stringify(param)] = {
        result,
        timestamp: new Date().getTime()
    };
    setData(data);
}

export function hasCached(stackId, chainId, param) {
    const data = getData();
    return data[stackId][chainId] && data[stackId][chainId][JSON.stringify(param)];
}

export function getCachedChainAction(stackId, chainId, param) {
    return getData()[stackId][chainId][JSON.stringify(param)];
}

export function clearCache(stackId, chainId) {
    const data = getData();
    delete data[stackId][chainId];
    setData(data);
}

export function deleteStack(stackId) {
    const data = getData();
    const stack = data[stackId];
    stack.chains.forEach(chainId => {
        const chain = data[chainId];
        for (let field in chain) {
            if (chain.hasOwnProperty(field)) {
                delete chain[field];
            }
        }
        delete data[chainId];
    });
    delete data[stackId];
    setData(data);
}

export function getStorage() {
    return Object.freeze(getData());
}

export function isExists(name) {
    return exists(getData(), name);
}

export function setChainConfig(config) {
    const data = getData();
    _setChainConfig(CHAIN_CONFIG, data, config);
    setData(data);
}

export function getLogMonitor() {
    return _getLogMonitor(CHAIN_CONFIG, getData());
}

export function getPlugins() {
    return _getPlugins(CHAIN_CONFIG, getData());
}
function getData() {
    return storage.__$store(STORE_ID);
}
function setData(data) {
    storage.__$store = (id) => {
        if (id !== STORE_ID) {
            throw new Error('Unauthorized storage access');
        }
        return data;
    }
}