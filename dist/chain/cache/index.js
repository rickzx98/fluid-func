'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cache = cache;

var _storage = require('../storage/');

function cache(stackId, chainId, param, cachedLast, action) {
    var paramJSON = {};
    var result = void 0;
    for (var field in param) {
        if (param.hasOwnProperty(field) && field !== '$chainId') {
            if (param[field]) {
                paramJSON[field] = param[field]();
            }
        }
    }

    if ((0, _storage.hasCached)(stackId, chainId, paramJSON)) {
        var cachedAction = (0, _storage.getCachedChainAction)(stackId, chainId, paramJSON);
        var currentTime = new Date().getTime();
        var cachedTimeLast = currentTime - cachedAction.timestamp;
        if (cachedTimeLast <= cachedLast) {
            result = cachedAction.result;
        } else {
            (0, _storage.clearCache)(stackId, chainId);
        }
    }
    if (!result) {
        result = action(param);
        (0, _storage.cacheChainAction)(stackId, chainId, paramJSON, result);
    }
    return result;
}