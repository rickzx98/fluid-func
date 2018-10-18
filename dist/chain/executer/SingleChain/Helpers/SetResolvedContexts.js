"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SetResolvedContexts = function SetResolvedContexts(resolvedContext, context) {
    _classCallCheck(this, SetResolvedContexts);

    if (resolvedContext) {
        for (var field in resolvedContext) {
            if (resolvedContext.hasOwnProperty(field)) {
                var fieldData = resolvedContext[field];
                context.set(field, fieldData);
            }
        }
    }
};

exports.default = SetResolvedContexts;