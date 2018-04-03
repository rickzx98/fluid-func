'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validators = exports.Validators = function () {
    function Validators(field, context, specData, SpecFailedException) {
        _classCallCheck(this, Validators);

        this.field = field;
        this.context = context;
        this.specData = specData;
        this.SpecFailedException = SpecFailedException;
    }

    _createClass(Validators, [{
        key: 'runRequireValidation',
        value: function runRequireValidation() {
            var _this = this;

            var _specData = this.specData,
                require = _specData.require,
                requireMessage = _specData.requireMessage;

            var isRequired = require instanceof Function && require() || require;
            return new Promise(function (resolve, reject) {
                new _this.SpecFailedException(function () {
                    var contextData = _this.context.getData();
                    if (isRequired && (!contextData[_this.field] || contextData[_this.field]() === '')) {
                        reject({
                            field: _this.field,
                            error: new Error(requireMessage || 'Field ' + _this.field + ' is required.')
                        });
                    } else {
                        resolve();
                    }
                }, _this.field, reject);
            });
        }
    }, {
        key: 'runValidation',
        value: function runValidation() {
            var _this2 = this;

            var validator = this.specData.validator;

            return new Promise(function (resolve, reject) {
                new _this2.SpecFailedException(function () {
                    var contextData = _this2.context.getData();
                    if (validator) {
                        validator(contextData[_this2.field] ? contextData[_this2.field]() : undefined).then(function () {
                            resolve();
                        }).catch(function (error) {
                            reject({
                                field: _this2.field,
                                error: error
                            });
                        });
                    } else {
                        resolve();
                    }
                }, _this2.field, reject);
            });
        }
    }]);

    return Validators;
}();