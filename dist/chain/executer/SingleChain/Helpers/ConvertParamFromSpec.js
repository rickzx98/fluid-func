"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConvertParamFromSpec = function ConvertParamFromSpec(param, chainInstance) {
    _classCallCheck(this, ConvertParamFromSpec);

    var newParam = param;
    if (!!chainInstance.isStrict) {
        newParam = {};
        if (chainInstance.specs) {
            chainInstance.specs.forEach(function (spec) {
                newParam[spec.field] = param[spec.field];
            });
        }
    }
    this.getParam = function () {
        return newParam;
    };
};

exports.default = ConvertParamFromSpec;