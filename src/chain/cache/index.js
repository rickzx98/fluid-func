import { cacheChainAction, clearCache, getCachedChainAction, hasCached } from '../storage/';

export function cache(stackId, chainId, param, cachedLast, action) {
    const paramJSON = {};
    let result;
    for (let field in param) {
        if (param.hasOwnProperty(field) && field !== '$chainId') {
            if (param[field]) {
                paramJSON[field] = param[field]();
            }
        }
    }

    if (hasCached(stackId, chainId, paramJSON)) {
        const cachedAction = getCachedChainAction(stackId, chainId, paramJSON);
        const currentTime = new Date().getMilliseconds();
        const cachedTimeLast = currentTime - cachedAction.timestamp;
        if (cachedTimeLast <= cachedLast) {
            result = cachedAction.result;
        }
        else {
            clearCache(stackId, chainId);
        }
    }
    if (!result) {
        result = action(param);
        cacheChainAction(stackId, chainId, paramJSON, result);
    }
    return result;
}