"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = exports.Util = function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
        key: "convertToContextStructure",
        value: function convertToContextStructure(param, Context, generateUUID) {
            if (!(param instanceof Context)) {
                var newParam = Context.createContext(generateUUID());
                for (var name in param) {
                    if (param.hasOwnProperty(name)) {
                        newParam.set(name, param[name]);
                    }
                }
                return newParam.getData();
            }
            return param.getData();
        }
    }]);

    return Util;
}();