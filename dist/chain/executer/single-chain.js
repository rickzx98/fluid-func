'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SingleChain = exports.SingleChain = function () {
    function SingleChain(getChain, Context, propertyToContext, Reducer, addChainToStack, stackId, cache, logInfo, logError, executeAfter, executeBefore) {
        _classCallCheck(this, SingleChain);

        this.getChain = getChain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
        this.Reducer = Reducer;
        this.addChainToStack = addChainToStack;
        this.stackId = stackId;
        this.cache = cache;
        this.logInfo = logInfo;
        this.logError = logError;
        this.executeAfter = executeAfter;
        this.executeBefore = executeBefore;
    }

    _createClass(SingleChain, [{
        key: 'start',
        value: function start(initialParam, chains) {
            var _this = this;

            this.logInfo('SingleChain', {
                chain: chains,
                message: 'Starting',
                initialParam: initialParam
            });
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    var chain = _this.getChain(chains);
                    try {
                        _this.addChainToStack(_this.stackId, chain.$chainId);
                        var paramAsContext = new _this.Context(initialParam.$chainId());
                        addSpecToContext(chain.specs, paramAsContext);
                        paramAsContext.runSpecs().then(function () {
                            var param = convertParamFromSpec(Object.assign(initialParam, paramAsContext.getData()), chain);
                            _this.executeBefore(chain.func, param).then(function (resolvedPluginData) {
                                if (resolvedPluginData) {
                                    var newContext = new _this.Context('_before_temp');
                                    setResolvedContexts(resolvedPluginData, newContext);
                                    param = Object.assign(param, newContext.getData());
                                }
                                onBeforeChain(chain, param, resolve, function (err) {
                                    onFailChain(chain, err, function (context) {
                                        resolveChain(resolve, context, chains, _this.logInfo, _this.executeAfter, _this.Context);
                                    }, reject.bind(_this), _this, initialParam, chains, _this.logInfo, _this.logError);
                                }, _this.Context, function () {
                                    if (chain.reducer && param[chain.reducer]) {
                                        var array = param[chain.reducer]();
                                        new _this.Reducer(array, param, chain, _this.Context, _this.propertyToContext).reduce(function (err, result) {
                                            if (err) {
                                                onFailChain(chain, err, function (context) {
                                                    resolveChain(resolve, context, chains, _this.logInfo, _this.executeAfter, _this.Context);
                                                }, reject.bind(_this), _this, initialParam, chains, _this.logInfo, _this.logError);
                                            } else {
                                                resolveChain(resolve, result, chains, _this.logInfo, _this.executeAfter, _this.Context);
                                            }
                                        });
                                    } else {
                                        var action = chain.cachedLast ? _this.cache(_this.stackId, chains, param, chain.cachedLast, chain.action) : chain.action(param);
                                        var context = _this.Context.createContext(chain.$chainId);
                                        _this.logInfo('SingleChain', {
                                            chain: chains,
                                            message: 'Starting action',
                                            param: param
                                        });
                                        if (action !== undefined) {
                                            if (action instanceof Promise) {
                                                action.then(function (props) {
                                                    _this.propertyToContext(context, props);
                                                    resolveChain(resolve, context.getData(), chains, _this.logInfo, _this.executeAfter, _this.Context);
                                                }).catch(function (err) {
                                                    onFailChain(chain, err, function (context) {
                                                        resolveChain(resolve, context, chains, _this.logInfo);
                                                    }, reject.bind(_this), _this, initialParam, chains, _this.logInfo, _this.logError, _this.executeAfter, _this.Context);
                                                });
                                            } else {
                                                _this.propertyToContext(context, action);
                                                resolveChain(resolve, context.getData(), chains, _this.logInfo, _this.executeAfter, _this.Context);
                                            }
                                        } else {
                                            resolveChain(resolve, context.getData(), chains, _this.logInfo, _this.executeAfter, _this.Context);
                                        }
                                    }
                                });
                            }).catch(function (err) {
                                onFailChain(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains, _this.logInfo, _this.logError);
                            });
                        }).catch(function (err) {
                            onFailChain(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains, _this.logInfo, _this.logError);
                        });
                    } catch (err) {
                        onFailChain(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains, _this.logInfo, _this.logError);
                    }
                });
            });
        }
    }]);

    return SingleChain;
}();

var resolveChain = exports.resolveChain = function resolveChain(resolve, context, chain, logInfo, executeAfter, Context) {
    logInfo('SingleChain', {
        chain: chain,
        message: 'Completed',
        resolvedContext: context
    });
    executeAfter(chain, context).then(function (resolvedPluginData) {
        if (resolvedPluginData) {
            var newContext = new Context('_after_temp');
            setResolvedContexts(resolvedPluginData, newContext);
            context = Object.assign(context, newContext.getData());
        }
        resolve(context);
    }).catch(function (err) {
        throw err;
    });
};
var onBeforeChain = function onBeforeChain(chain, param, resolve, reject, Context, next) {
    try {
        var onbefore = chain.onbefore(param);
        if (onbefore instanceof Promise) {
            onbefore.then(function (con) {
                if (con) {
                    next();
                } else {
                    resolve(Context.createContext(chain.$chainId).getData());
                }
            }).catch(function (err) {
                reject(err);
            });
        } else if (onbefore) {
            next();
        } else {
            resolve(Context.createContext(chain.$chainId).getData());
        }
    } catch (err) {
        reject(err);
    }
};

var onFailChain = function onFailChain(chain, error, resolve, reject, singleChain, initialParam, chains, logInfo, logError) {
    error = Object.assign(error, { func: chain.func });
    logError('SingleChain', error);
    logInfo('SingleChain', {
        chain: chains,
        message: 'Failed to complete',
        params: initialParam
    });
    if (chain.onfail) {
        chain.onfail(error, function () {
            singleChain.start(initialParam, chains).then(function (result) {
                resolve(result);
            }).catch(function (err) {
                reject(err);
            });
        }, function () {
            reject(error);
        });
    } else {
        reject(error);
    }
};
var convertParamFromSpec = function convertParamFromSpec(param, chainInstance) {
    var newParam = param;
    if (!!chainInstance.isStrict) {
        newParam = {};
        if (chainInstance.specs) {
            chainInstance.specs.forEach(function (spec) {
                newParam[spec.field] = param[spec.field];
            });
        }
    }
    return newParam;
};

var addSpecToContext = function addSpecToContext(specs, context) {
    if (specs) {
        specs.forEach(function (spec) {
            context.addSpec(spec);
        });
    }
};

var setResolvedContexts = function setResolvedContexts(resolvedContext, context) {
    if (resolvedContext) {
        for (var field in resolvedContext) {
            if (resolvedContext.hasOwnProperty(field)) {
                var fieldData = resolvedContext[field];
                context.set(field, fieldData);
            }
        }
    }
};