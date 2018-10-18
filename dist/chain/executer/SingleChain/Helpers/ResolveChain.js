'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _SetResolvedContexts = require('./SetResolvedContexts');

var _SetResolvedContexts2 = _interopRequireDefault(_SetResolvedContexts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResolveChain = function ResolveChain(resolve, context, chain, logInfo, executeAfter, Context) {
    _classCallCheck(this, ResolveChain);

    logInfo('SingleChain', {
        chain: chain,
        message: 'Completed',
        resolvedContext: context
    });
    executeAfter(chain, context).then(function (resolvedPluginData) {
        if (resolvedPluginData) {
            var newContext = new Context('_after_temp');
            new _SetResolvedContexts2.default(resolvedPluginData, newContext);
            context = Object.assign(context, newContext.getData());
        }
        resolve(context);
    }).catch(function (err) {
        throw err;
    });
};

exports.default = ResolveChain;