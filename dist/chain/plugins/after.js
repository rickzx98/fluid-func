"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var executeActions = function executeActions(context, plugins) {
    var resolvedContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var done = arguments[4];

    if (index < plugins.length) {
        try {
            var plugin = plugins[index];
            var action = plugin.action(context);
            if (action instanceof Promise) {
                action.then(function (data) {
                    resolvedContext = _extends({}, resolvedContext);
                    resolvedContext[plugin.name] = data;
                    index++;
                    executeActions(context, plugins, resolvedContext, index, done);
                }).catch(function (err) {
                    done(err);
                });
            } else {
                if (action) {
                    resolvedContext = _extends({}, resolvedContext);
                    resolvedContext[plugin.name] = action;
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
};

var executeAfterPlugins = exports.executeAfterPlugins = function executeAfterPlugins(chain, context, plugins) {
    var afterChain = "after_" + chain;
    var chainPlugins = plugins ? plugins[afterChain] : undefined;
    return new Promise(function (resolve, reject) {
        if (chainPlugins) {
            executeActions(context, chainPlugins, {}, 0, function (err, resolvedContext) {
                if (err) {
                    reject(err);
                } else {
                    resolve(resolvedContext);
                }
            });
        } else {
            resolve();
        }
    });
};