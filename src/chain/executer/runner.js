export class Runner {
    constructor(getChain, generateUUID, Context, SingleChain, ArrayChain, Reducer, Util,
        createExecutionStack, addChainToStack,
        deleteStack, cache, logInfo, logError,
        executeAfter, executeBefore) {
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.SingleChain = SingleChain;
        this.ArrayChain = ArrayChain;
        this.Reducer = Reducer;
        this.Util = Util;
        this.createExecutionStack = createExecutionStack;
        this.addChainToStack = addChainToStack;
        this.deleteStack = deleteStack;
        this.cache = cache;
        this.logInfo = logInfo;
        this.logError = logError;
        this.executeAfter = executeAfter;
        this.executeBefore = executeBefore;
    }

    start(param, chains) {
        if (chains) {
            const newParam = this.Util.convertToContextStructure(param, this.Context, this.generateUUID);
            const stackId = this.createExecutionStack();
            this.logInfo('Runner', `Started sequence stack#${stackId}`);
            this.addChainToStack(stackId, newParam.$chainId());
            if (chains instanceof Array) {
                return new this.ArrayChain(this.getChain, this.generateUUID, this.Context,
                    new this.SingleChain(this.getChain,
                        this.Context, propertyToContext, this.Reducer,
                        this.addChainToStack, stackId, this.cache,
                        this.logInfo, this.logError,
                        this.executeAfter, this.executeBefore)
                ).start(newParam, chains)
                    .then(result => {
                        return new Promise((resolve, reject) => {
                            try {
                                this.logInfo('Runner', `Completed stack#${stackId}`);
                                this.deleteStack(stackId);
                                resolve(result);
                            } catch (err) {
                                reject(err)
                            }
                        });
                    }).catch(error => {
                        this.logError('Runner', error);
                        return new Promise((resolve, reject) => {
                            try {
                                this.deleteStack(stackId);
                                reject({
                                    stackId,
                                    error
                                });
                            } catch (err) {
                                reject(err)
                            }
                        });
                    });
            } else {
                return new this.SingleChain(this.getChain,
                    this.Context, propertyToContext, this.Reducer,
                    this.addChainToStack, stackId, this.cache,
                    this.logInfo, this.logError,
                    this.executeAfter, this.executeBefore)
                    .start(newParam, chains)
                    .then(result => {
                        return new Promise((resolve, reject) => {
                            try {
                                this.logInfo('Runner', `Completed stack#${stackId}`);
                                this.deleteStack(stackId);
                                resolve(result);
                            } catch (err) {
                                reject(err)
                            }
                        });
                    }).catch(error => {
                        this.logError('Runner', error);
                        return new Promise((resolve, reject) => {
                            try {
                                this.deleteStack(stackId);
                                reject({
                                    stackId,
                                    error
                                });
                            } catch (err) {
                                reject(err)
                            }
                        });
                    });
            }
        }
    }
}


const propertyToContext = (context, chainReturn) => {
    if (chainReturn !== undefined) {
        if (chainReturn instanceof Object) {
            for (let name in chainReturn) {
                if (chainReturn.hasOwnProperty(name)) {
                    context.set(name, chainReturn[name]);
                }
            }
        } else {
            context.set('value', chainReturn);
        }
    }
};
