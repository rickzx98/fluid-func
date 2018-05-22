export class SingleChain {
    constructor(getChain, Context, propertyToContext, Reducer, addChainToStack, stackId, cache, logInfo, logError, executeAfter, executeBefore) {
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

    start(initialParam, chains) {
        this.logInfo('SingleChain', {
            chain: chains,
            message: 'Starting',
            initialParam
        });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const chain = this.getChain(chains);
                try {
                    this.addChainToStack(this.stackId, chain.$chainId);
                    const paramAsContext = new this.Context(initialParam.$chainId());
                    addSpecToContext(chain.specs, paramAsContext);
                    addInitialParam(initialParam, paramAsContext);
                    paramAsContext.runSpecs().then(() => {
                        let param = convertParamFromSpec(Object.assign(initialParam, paramAsContext.getData()), chain);
                        this.executeBefore(chain.func, param)
                            .then(resolvedPluginData => {
                                if (resolvedPluginData) {
                                    const newContext = new this.Context('_before_temp');
                                    setResolvedContexts(resolvedPluginData, newContext);
                                    param = Object.assign(param, newContext.getData());
                                }
                                onBeforeChain(chain, param, resolve, (err) => {
                                    onFailChain(chain, err, (context) => {
                                        resolveChain(resolve, context, chains, this.logInfo, this.executeAfter, this.Context);
                                    }, reject.bind(this), this, initialParam, chains, this.logInfo, this.logError);
                                }, this.Context, () => {
                                    if (chain.reducer && param[chain.reducer]) {
                                        const array = param[chain.reducer]();
                                        new this.Reducer(array, param, chain,
                                            this.Context, this.propertyToContext)
                                            .reduce((err, result) => {
                                                if (err) {
                                                    onFailChain(chain, err, (context) => {
                                                        resolveChain(resolve, context, chains, this.logInfo, this.executeAfter, this.Context);
                                                    }, reject.bind(this), this, initialParam, chains, this.logInfo, this.logError);
                                                } else {
                                                    resolveChain(resolve, result, chains, this.logInfo, this.executeAfter, this.Context);
                                                }
                                            });
                                    } else {
                                        const action = chain.cachedLast ? this.cache(this.stackId, chains,
                                            param, chain.cachedLast, chain.action) : chain.action(param);
                                        const context = this.Context.createContext(chain.$chainId);
                                        this.logInfo('SingleChain', {
                                            chain: chains,
                                            message: 'Starting action',
                                            param
                                        });
                                        if (action !== undefined) {
                                            if (action instanceof Promise) {
                                                action.then(props => {
                                                    this.propertyToContext(context, props);
                                                    resolveChain(resolve, context.getData(), chains, this.logInfo, this.executeAfter, this.Context);
                                                }).catch(err => {
                                                    onFailChain(chain, err, (context) => {
                                                        resolveChain(resolve, context, chains, this.logInfo);
                                                    }, reject.bind(this), this, initialParam, chains, this.logInfo, this.logError, this.executeAfter, this.Context);
                                                });
                                            } else {
                                                this.propertyToContext(context, action);
                                                resolveChain(resolve, context.getData(), chains, this.logInfo, this.executeAfter, this.Context);
                                            }
                                        } else {
                                            resolveChain(resolve, context.getData(), chains, this.logInfo, this.executeAfter, this.Context);
                                        }
                                    }
                                });
                            }).catch(err => {
                                onFailChain(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains, this.logInfo, this.logError);
                            })
                    }).catch(err => {
                        onFailChain(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains, this.logInfo, this.logError);
                    });
                } catch (err) {
                    onFailChain(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains, this.logInfo, this.logError);
                }
            });
        });
    }
}

export const resolveChain = (resolve, context, chain, logInfo, executeAfter, Context) => {
    logInfo('SingleChain', {
        chain,
        message: 'Completed',
        resolvedContext: context
    });
    executeAfter(chain, context).then(resolvedPluginData => {
        if (resolvedPluginData) {
            const newContext = new Context('_after_temp');
            setResolvedContexts(resolvedPluginData, newContext);
            context = Object.assign(context, newContext.getData());
        }
        resolve(context);
    }).catch(err => {
        throw err;
    });
};
const onBeforeChain = (chain, param, resolve, reject, Context, next) => {
    try {
        const onbefore = chain.onbefore(param);
        if (onbefore instanceof Promise) {
            onbefore.then(con => {
                if (con) {
                    next();
                } else {
                    resolve(Context.createContext(chain.$chainId).getData());
                }
            }).catch(err => {
                reject(err);
            })
        } else if (onbefore) {
            next();
        } else {
            resolve(Context.createContext(chain.$chainId).getData());
        }
    } catch (err) {
        reject(err);
    }
};

const onFailChain = (chain, error, resolve, reject, singleChain, initialParam, chains, logInfo, logError) => {
    error = Object.assign(error, { func: chain.func });
    logError('SingleChain', error);
    logInfo('SingleChain', {
        chain: chains,
        message: 'Failed to complete',
        params: initialParam
    });
    if (chain.onfail) {
        chain.onfail(error, () => {
            singleChain.start(initialParam, chains)
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        }, () => {
            reject(error);
        });
    } else {
        reject(error);
    }
};
const convertParamFromSpec = (param, chainInstance) => {
    let newParam = param;
    if (!!chainInstance.isStrict) {
        newParam = {};
        if (chainInstance.specs) {
            chainInstance.specs.forEach(spec => {
                newParam[spec.field] = param[spec.field];
            });
        }
    }
    return newParam;
};
const addInitialParam = (initialParam, context) => {
    Object.keys(initialParam).forEach(field => {
        context.set(field, initialParam[field]());
    });
};
const addSpecToContext = (specs, context) => {
    if (specs) {
        specs.forEach(spec => {
            context.addSpec(spec);
        });
    }
};

const setResolvedContexts = (resolvedContext, context) => {
    if (resolvedContext) {
        for (let field in resolvedContext) {
            if (resolvedContext.hasOwnProperty(field)) {
                const fieldData = resolvedContext[field];
                context.set(field, fieldData);
            }
        }
    }
};