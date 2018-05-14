'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getPlugins = exports.getPlugins = function getPlugins(config, props) {
    var plugins = {};
    if (props.plugins) {
        if (props.plugins instanceof Array) {
            props.plugins.forEach(function (plugin) {
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
            var chain = void 0;
            chains.forEach(function (chain) {
                var beforeChain = 'before_' + chain;
                if (!plugins[beforeChain]) {
                    plugins[beforeChain] = [];
                }
                chain = plugins[beforeChain];
                chain.push({ name: name, action: action });
            });
        } else {
            throw new Error('plugin.before must be array');
        }
    }
}
function addPluginAfter(chains, action, name, plugins) {
    if (chains) {
        if (chains instanceof Array) {
            var chain = void 0;
            chains.forEach(function (chain) {
                var afterChain = 'after_' + chain;
                if (!plugins[afterChain]) {
                    plugins[afterChain] = [];
                }
                chain = plugins[afterChain];
                chain.push({ name: name, action: action });
            });
        } else {
            throw new Error('plugin.after must be array');
        }
    }
}