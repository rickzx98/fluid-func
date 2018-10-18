import AddSpecToContext from "./Helpers/AddSpecToContext";
import AddInitialParam from "./Helpers/AddInitialParam";
import ConvertParamFromSpec from "./Helpers/ConvertParamFromSpec";
import SetResolvedContexts from "./Helpers/SetResolvedContexts";
import OnBefore from "./LifeCycle/OnBefore";
import OnFail from "./LifeCycle/OnFail";
import ResolveChain from "./Helpers/ResolveChain";
export default class StartChain {
    constructor(getChain, Context, propertyToContext, Reducer,
        addChainToStack, stackId, cache, logInfo, logError,
        executeAfter, executeBefore) {
        this.start = (initialParam, chains) => {
            logInfo('SingleChain', {
                chain: chains,
                message: 'Starting',
                initialParam
            });

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const chain = getChain(chains);
                    try {
                        addChainToStack(stackId, chain.$chainId);
                        const paramAsContext = new Context(initialParam.$chainId());
                        new AddSpecToContext(chain.specs, paramAsContext);
                        new AddInitialParam(initialParam, paramAsContext);
                        paramAsContext.runSpecs().then(() => {
                            const initialData = paramAsContext.getData();
                            let param = new ConvertParamFromSpec(Object.assign(initialParam, initialData), chain).getParam();
                            executeBefore(chain.func, param)
                                .then(resolvedPluginData => {
                                    const newContext = new Context('_before_temp');
                                    new SetResolvedContexts(resolvedPluginData, newContext);
                                    param = Object.assign(param, newContext.getData());
                                    new OnBefore(chain, param, resolve, (err) => {
                                        new OnFail(chain, err, context => {
                                            new ResolveChain(resolve, context, chains, logInfo, executeAfter, Context);
                                        }, reject.bind(this), this, initialParam, chains, logInfo, logError);
                                    }, Context, () => {
                                        if (chain.reducer && param[chain.reducer]) {
                                            const array = param[chain.reducer]();
                                            new Reducer(array, param, chain,
                                                Context, propertyToContext)
                                                .reduce((err, result) => {
                                                    if (err) {
                                                        new OnFail(chain, err, (context) => {
                                                            new ResolveChain(resolve, context, chains, logInfo, executeAfter, Context);
                                                        }, reject.bind(this), this, initialParam, chains, logInfo, logError);
                                                    } else {
                                                        new ResolveChain(resolve, result, chains, logInfo, executeAfter, Context);
                                                    }
                                                });
                                        }
                                        else {
                                            const action = chain.cachedLast ? cache(stackId, chains,
                                                param, chain.cachedLast, chain.action) : chain.action(param);
                                            const context = Context.createContext(chain.$chainId);
                                            logInfo('SingleChain', {
                                                chain: chains,
                                                message: 'Starting action',
                                                param
                                            });
                                            if (action !== undefined) {
                                                if (action instanceof Promise) {
                                                    action.then(props => {
                                                        propertyToContext(context, props);
                                                        new ResolveChain(resolve, context.getData(), chains, logInfo, executeAfter, Context);
                                                    }).catch(err => {
                                                        new OnFail(chain, err, (context) => {
                                                            new ResolveChain(resolve, context, chains, logInfo);
                                                        }, reject.bind(this), this, initialParam, chains, logInfo, logError, executeAfter, Context);
                                                    });
                                                } else {
                                                    propertyToContext(context, action);
                                                    new ResolveChain(resolve, context.getData(), chains, logInfo, executeAfter, Context);
                                                }
                                            } else {
                                                new ResolveChain(resolve, context.getData(), chains, logInfo, executeAfter, Context);
                                            }
                                        }
                                    });
                                }).catch(err => {
                                    new OnFail(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains, logInfo, logError);
                                });
                        }).catch(err => {
                            new OnFail(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains, logInfo, logError);
                        });
                    } catch (err) {
                        new OnFail(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains, logInfo, logError);
                    }
                });
            });
        }
    }
}
