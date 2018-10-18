"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddSpecToContext = function AddSpecToContext(specs, context) {
    _classCallCheck(this, AddSpecToContext);

    if (specs) {
        specs.forEach(function (spec) {
            context.addSpec(spec);
        });
    }
};

exports.default = AddSpecToContext;