const executeActions = (context, plugins, resolvedContext = {}, index = 0, done) => {
    if (index < plugins.length) {
        try {
            const plugin = plugins[index];
            const action = plugin.action(context);
            if (action instanceof Promise) {
                action.then((data) => {
                    resolvedContext = { ...resolvedContext, ...data };
                    index++;
                    executeActions(context, plugins, resolvedContext, index, done);
                }).catch(err => { done(err); });
            } else {
                if (action) {
                    resolvedContext = { ...resolvedContext, ...action };
                }
                index++;
                executeActions(context, plugins, resolvedContext, index, done);
            }
        } catch (err) {
            done(err);
        }
    } else {
        done(undefined, resolvedContext);
    }
}

export const executeBeforePlugins = (chain, context, plugins) => {
    const beforeChain = `before_${chain}`;
    const chainPlugins = plugins[beforeChain];
    return new Promise((resolve, reject) => {
        if (chainPlugins) {
            executeActions(context, chainPlugins, {}, 0, (err, resolvedContext) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resolvedContext)
                }
            });
        }
    });
};

