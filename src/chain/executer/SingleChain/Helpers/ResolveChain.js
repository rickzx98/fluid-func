import SetResolvedContexts from "./SetResolvedContexts";

export default class ResolveChain {
    constructor(resolve, context, chain, logInfo, executeAfter, Context) {
        logInfo('SingleChain', {
            chain,
            message: 'Completed',
            resolvedContext: context
        });
        executeAfter(chain, context).then(resolvedPluginData => {
            if (resolvedPluginData) {
                const newContext = new Context('_after_temp');
                new SetResolvedContexts(resolvedPluginData, newContext);
                context = Object.assign(context, newContext.getData());
            }
            resolve(context);
        }).catch(err => {
            throw err;
        });
    }
}