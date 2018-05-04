'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getChain = getChain;
exports.getChainContext = getChainContext;
exports.putChain = putChain;
exports.putChainContext = putChainContext;
exports.getChainDataById = getChainDataById;
exports.createExecutionStack = createExecutionStack;
exports.addChainToStack = addChainToStack;
exports.cacheChainAction = cacheChainAction;
exports.hasCached = hasCached;
exports.getCachedChainAction = getCachedChainAction;
exports.clearCache = clearCache;
exports.deleteStack = deleteStack;
exports.getStorage = getStorage;
exports.isExists = isExists;
exports.setChainConfig = setChainConfig;
exports.getLogMonitor = getLogMonitor;

var _get = require('./get');

var _put = require('./put');

var _exists = require('./exists');

var _Util = require('../Util');

var _constants = require('./constants');

if (global && !global.__$fs__) {
    global.__$fs__ = {};
} else if (window && !window.__$fs__) {
    window.__$fs__ = {};
}

var storage = global.__$fs__ || window.__$fs__;

function getChain(name) {
    return (0, _get.getChain)(storage, name);
}

function getChainContext(chainId, field) {
    return (0, _get.getChainContext)(storage, chainId, field);
}

function putChain(name, chain) {
    (0, _put.putChain)(storage, _exists.exists, name, chain);
}

function putChainContext(chainId, field, value) {
    (0, _put.putChainContext)(storage, chainId, field, value);
}

function getChainDataById(chainId) {
    return (0, _get.getChainDataById)(storage, chainId);
}

function createExecutionStack() {
    var stackId = (0, _Util.generateUUID)();
    storage[stackId] = {
        type: 'execution',
        chains: []
    };
    return stackId;
}

function addChainToStack(stackId, chainId) {
    storage[stackId].chains.push(chainId);
}

function cacheChainAction(stackId, chainId, param, result) {
    storage[stackId][chainId] = {};
    storage[stackId][chainId][JSON.stringify(param)] = {
        result: result,
        timestamp: new Date().getTime()
    };
}

function hasCached(stackId, chainId, param) {
    return storage[stackId][chainId] && storage[stackId][chainId][JSON.stringify(param)];
}

function getCachedChainAction(stackId, chainId, param) {
    return storage[stackId][chainId][JSON.stringify(param)];
}

function clearCache(stackId, chainId) {
    delete storage[stackId][chainId];
}

function deleteStack(stackId) {
    var stack = storage[stackId];
    stack.chains.forEach(function (chainId) {
        var chain = storage[chainId];
        for (var field in chain) {
            if (chain.hasOwnProperty(field)) {
                delete chain[field];
            }
        }
        delete storage[chainId];
    });
    delete storage[stackId];
}

function getStorage() {
    return Object.freeze(storage);
}

function isExists(name) {
    return (0, _exists.exists)(storage, name);
}

function setChainConfig(config) {
    (0, _put.setChainConfig)(_constants.CHAIN_CONFIG, storage, config);
}

function getLogMonitor() {
    return (0, _get.getLogMonitor)(_constants.CHAIN_CONFIG, storage);
}