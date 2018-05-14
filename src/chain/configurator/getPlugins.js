export const getPlugins = (config, props) => {
    let plugins = {};
    if (props.plugins) {
        if (props.plugins instanceof Array) {
            props.plugins.forEach(plugin => {
                if (!plugin.action) {
                    throw new Error('plugin must have .action function');
                }
                if (plugin.before || plugin.after) {
                    addPluginBefore(plugin.before, plugin.action, plugin.name, plugins);
                    addPluginAfter(plugin.after, plugin.action, plugin.name, plugins);
                } else {
                    throw new Error('plugin must have alteast one .before or .after array');
                }
            });
        } else {
            throw new Error('plugins must be array');
        }
    }
    config.plugins = plugins;
};


function addPluginBefore(chains, action, name, plugins) {
    if (chains) {
        if (chains instanceof Array) {
            let chain;
            chains.forEach(chain => {
                let beforeChain = `before_${chain}`;
                if (!plugins[beforeChain]) {
                    plugins[beforeChain] = [];
                }
                chain = plugins[beforeChain];
                chain.push({ name, action });
            });
        } else {
            throw new Error('plugin.before must be array');
        }
    }
}
function addPluginAfter(chains, action, name, plugins) {
    if (chains) {
        if (chains instanceof Array) {
            let chain;
            chains.forEach(chain => {
                let afterChain = `after_${chain}`;
                if (!plugins[afterChain]) {
                    plugins[afterChain] = [];
                }
                chain = plugins[afterChain];
                chain.push({ name, action });
            });
        } else {
            throw new Error('plugin.after must be array');
        }
    }
}