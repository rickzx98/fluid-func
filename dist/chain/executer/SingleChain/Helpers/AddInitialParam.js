"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AddInitialParam = function AddInitialParam(initialParam, context) {
    _classCallCheck(this, AddInitialParam);

    Object.keys(initialParam).forEach(function (field) {
        if (field !== "$chainId" && field !== "$$$validators") {
            context.set(field, initialParam[field]());
        }
    });
};

exports.default = AddInitialParam;