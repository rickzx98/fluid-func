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
exports.getPlugins = getPlugins;

var _get = require('./get');

var _put = require('./put');

var _constants = require('./constants');

var _exists = require('./exists');

var _Util = require('../Util');

var STORE_ID = (0, _Util.generateUUID)();
var defaultStorage = {
    __$store: function __$store(id) {
        return [];
    }
};

if (global && !global.__$fs__) {
    global.__$fs__ = defaultStorage;
} else if (window && !window.__$fs__) {
    window.__$fs__ = defaultStorage;
}

var storage = global.__$fs__ || window.__$fs__;

function getChain(name) {
    return (0, _get.getChain)(getData(), name);
}

function getChainContext(chainId, field) {
    return (0, _get.getChainContext)(getData(), chainId, field);
}

function putChain(name, chain) {
    var data = getData();
    (0, _put.putChain)(data, _exists.exists, name, chain);
    setData(data);
}

function putChainContext(chainId, field, value) {
    var data = getData();
    (0, _put.putChainContext)(data, chainId, field, value);
    setData(data);
}

function getChainDataById(chainId) {
    return (0, _get.getChainDataById)(getData(), chainId);
}

function createExecutionStack() {
    var data = getData();
    var stackId = (0, _Util.generateUUID)();
    data[stackId] = {
        type: 'execution',
        chains: []
    };
    setData(data);
    return stackId;
}

function addChainToStack(stackId, chainId) {
    var data = getData();
    data[stackId].chains.push(chainId);
    setData(data);
}

function cacheChainAction(stackId, chainId, param, result) {
    var data = getData();
    data[stackId][chainId] = {};
    data[stackId][chainId][JSON.stringify(param)] = {
        result: result,
        timestamp: new Date().getTime()
    };
    setData(data);
}

function hasCached(stackId, chainId, param) {
    var data = getData();
    return data[stackId][chainId] && data[stackId][chainId][JSON.stringify(param)];
}

function getCachedChainAction(stackId, chainId, param) {
    return getData()[stackId][chainId][JSON.stringify(param)];
}

function clearCache(stackId, chainId) {
    var data = getData();
    delete data[stackId][chainId];
    setData(data);
}

function deleteStack(stackId) {
    var data = getData();
    var stack = data[stackId];
    stack.chains.forEach(function (chainId) {
        var chain = data[chainId];
        for (var field in chain) {
            if (chain.hasOwnProperty(field)) {
                delete chain[field];
            }
        }
        delete data[chainId];
    });
    delete data[stackId];
    setData(data);
}

function getStorage() {
    return Object.freeze(getData());
}

function isExists(name) {
    return (0, _exists.exists)(getData(), name);
}

function setChainConfig(config) {
    var data = getData();
    (0, _put.setChainConfig)(_constants.CHAIN_CONFIG, data, config);
    setData(data);
}

function getLogMonitor() {
    return (0, _get.getLogMonitor)(_constants.CHAIN_CONFIG, getData());
}

function getPlugins() {
    return (0, _get.getPlugins)(_constants.CHAIN_CONFIG, getData());
}
function getData() {
    return storage.__$store(STORE_ID);
}
function setData(data) {
    storage.__$store = function (id) {
        if (id !== STORE_ID) {
            throw new Error('Unauthorized storage access');
        }
        return data;
    };
}