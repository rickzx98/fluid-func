'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VALIDATORS = '$$$validators';

var Validators = exports.Validators = function () {
    function Validators(chainId, getChainContext, CollectPromiseResult) {
        _classCallCheck(this, Validators);

        this.chainId = chainId;
        this.getChainContext = getChainContext;
        this.CollectPromiseResult = CollectPromiseResult;
    }

    _createClass(Validators, [{
        key: 'addSpec',
        value: function addSpec(fieldSpec, setChainContextValue) {
            var old_validators = this.getChainContext(this.chainId, VALIDATORS);
            var validators = Object.assign([], [].concat(_toConsumableArray(old_validators ? old_validators() : []), [fieldSpec]));
            setChainContextValue(VALIDATORS, validators);
        }
    }, {
        key: 'runValidations',
        value: function runValidations(context) {
            var _this = this;

            var _validators = this.getChainContext(this.chainId, VALIDATORS) ? this.getChainContext(this.chainId, VALIDATORS)() : [];
            var validators = _validators.map(function (validator) {
                return validator.runValidation(context);
            });
            return new Promise(function (resolve, reject) {
                new _this.CollectPromiseResult(validators).collect(function (result) {
                    if (result.error && result.error.length > 0) {
                        reject(result.error);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }, {
        key: 'runSpecs',
        value: function runSpecs(context) {
            var _this2 = this;

            var _validators = this.getChainContext(this.chainId, VALIDATORS) ? this.getChainContext(this.chainId, VALIDATORS)() : [];
            var validators = _validators.map(function (validator) {
                var promises = validator.actions.map(function (action) {
                    switch (action) {
                        case 'require':
                            return validator.runRequireValidation(context);
                        case 'validate':
                            return validator.runValidation(context);
                        case 'default':
                            return validator.runDefault(context);
                        case 'transform':
                            return validator.runTransform(context);
                        case 'translate':
                            return validator.runTranslate(context);
                    }
                });
                return Promise.all(promises);
            });
            return new Promise(function (resolve, reject) {
                new _this2.CollectPromiseResult(validators).collect(function (result) {
                    if (result.error && result.error.length > 0) {
                        reject(result.error);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }]);

    return Validators;
}();