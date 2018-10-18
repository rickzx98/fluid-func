"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _AddSpecToContext = require("./Helpers/AddSpecToContext");

var _AddSpecToContext2 = _interopRequireDefault(_AddSpecToContext);

var _AddInitialParam = require("./Helpers/AddInitialParam");

var _AddInitialParam2 = _interopRequireDefault(_AddInitialParam);

var _ConvertParamFromSpec = require("./Helpers/ConvertParamFromSpec");

var _ConvertParamFromSpec2 = _interopRequireDefault(_ConvertParamFromSpec);

var _SetResolvedContexts = require("./Helpers/SetResolvedContexts");

var _SetResolvedContexts2 = _interopRequireDefault(_SetResolvedContexts);

var _OnBefore = require("./LifeCycle/OnBefore");

var _OnBefore2 = _interopRequireDefault(_OnBefore);

var _OnFail = require("./LifeCycle/OnFail");

var _OnFail2 = _interopRequireDefault(_OnFail);

var _ResolveChain = require("./Helpers/ResolveChain");

var _ResolveChain2 = _interopRequireDefault(_ResolveChain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StartChain = function StartChain(getChain, Context, propertyToContext, Reducer, addChainToStack, stackId, cache, logInfo, logError, executeAfter, executeBefore) {
    var _this = this;

    _classCallCheck(this, StartChain);

    this.start = function (initialParam, chains) {
        logInfo('SingleChain', {
            chain: chains,
            message: 'Starting',
            initialParam: initialParam
        });

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var chain = getChain(chains);
                try {
                    addChainToStack(stackId, chain.$chainId);
                    var paramAsContext = new Context(initialParam.$chainId());
                    new _AddSpecToContext2.default(chain.specs, paramAsContext);
                    new _AddInitialParam2.default(initialParam, paramAsContext);
                    paramAsContext.runSpecs().then(function () {
                        var initialData = paramAsContext.getData();
                        var param = new _ConvertParamFromSpec2.default(Object.assign(initialParam, initialData), chain).getParam();
                        executeBefore(chain.func, param).then(function (resolvedPluginData) {
                            var newContext = new Context('_before_temp');
                            new _SetResolvedContexts2.default(resolvedPluginData, newContext);
                            param = Object.assign(param, newContext.getData());
                            new _OnBefore2.default(chain, param, resolve, function (err) {
                                new _OnFail2.default(chain, err, function (context) {
                                    new _ResolveChain2.default(resolve, context, chains, logInfo, executeAfter, Context);
                                }, reject.bind(_this), _this, initialParam, chains, logInfo, logError);
                            }, Context, function () {
                                if (chain.reducer && param[chain.reducer]) {
                                    var array = param[chain.reducer]();
                                    new Reducer(array, param, chain, Context, propertyToContext).reduce(function (err, result) {
                                        if (err) {
                                            new _OnFail2.default(chain, err, function (context) {
                                                new _ResolveChain2.default(resolve, context, chains, logInfo, executeAfter, Context);
                                            }, reject.bind(_this), _this, initialParam, chains, logInfo, logError);
                                        } else {
                                            new _ResolveChain2.default(resolve, result, chains, logInfo, executeAfter, Context);
                                        }
                                    });
                                } else {
                                    var action = chain.cachedLast ? cache(stackId, chains, param, chain.cachedLast, chain.action) : chain.action(param);
                                    var context = Context.createContext(chain.$chainId);
                                    logInfo('SingleChain', {
                                        chain: chains,
                                        message: 'Starting action',
                                        param: param
                                    });
                                    if (action !== undefined) {
                                        if (action instanceof Promise) {
                                            action.then(function (props) {
                                                propertyToContext(context, props);
                                                new _ResolveChain2.default(resolve, context.getData(), chains, logInfo, executeAfter, Context);
                                            }).catch(function (err) {
                                                new _OnFail2.default(chain, err, function (context) {
                                                    new _ResolveChain2.default(resolve, context, chains, logInfo);
                                                }, reject.bind(_this), _this, initialParam, chains, logInfo, logError, executeAfter, Context);
                                            });
                                        } else {
                                            propertyToContext(context, action);
                                            new _ResolveChain2.default(resolve, context.getData(), chains, logInfo, executeAfter, Context);
                                        }
                                    } else {
                                        new _ResolveChain2.default(resolve, context.getData(), chains, logInfo, executeAfter, Context);
                                    }
                                }
                            });
                        }).catch(function (err) {
                            new _OnFail2.default(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains, logInfo, logError);
                        });
                    }).catch(function (err) {
                        new _OnFail2.default(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains, logInfo, logError);
                    });
                } catch (err) {
                    new _OnFail2.default(chain, err, resolve.bind(_this), reject.bind(_this), _this, initialParam, chains, logInfo, logError);
                }
            });
        });
    };
};

exports.default = StartChain;