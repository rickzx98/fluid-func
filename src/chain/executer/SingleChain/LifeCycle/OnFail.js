export default class OnFail {
    constructor(chain, error, resolve, reject, singleChain, initialParam, chains, logInfo, logError) {
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
    }
}