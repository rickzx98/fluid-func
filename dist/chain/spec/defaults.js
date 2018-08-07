"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Defaults = exports.Defaults = function () {
    function Defaults(field, specData, context, SpecFailedException) {
        _classCallCheck(this, Defaults);

        this.field = field;
        this.specData = specData;
        this.context = context;
        this.SpecFailedException = SpecFailedException;
    }

    _createClass(Defaults, [{
        key: "runDefault",
        value: function runDefault() {
            var _this = this;

            var defaultValue = this.specData.defaultValue;

            return new Promise(function (resolve, reject) {
                new _this.SpecFailedException(function () {
                    try {
                        var currentData = _this.context.getData();
                        if (currentData[_this.field] === undefined || currentData[_this.field]() === undefined) {
                            _this.context.set(_this.field, defaultValue);
                        }
                        resolve();
                    } catch (err) {
                        reject({ error: err, field: _this.field });
                    }
                }, _this.field, reject);
            });
        }
    }]);

    return Defaults;
}();