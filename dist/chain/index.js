'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Chain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = require('./storage/');

var _executer = require('./executer/');

var _spec = require('./spec/');

var _spec2 = _interopRequireDefault(_spec);

var _configurator = require('./configurator/');

var _configurator2 = _interopRequireDefault(_configurator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chain = function () {
    function Chain(name) {
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (parameter) {};
        var sequence = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        _classCallCheck(this, Chain);

        this.action = action;
        this.specs = [];
        this.onbefore = function () {
            return true;
        };
        this.sequence = sequence || [];
        if (!this.sequence.length) {
            this.sequence.push(name);
        }
        (0, _storage.putChain)(name, this);
    }

    _createClass(Chain, [{
        key: 'connect',
        value: function connect(name) {
            this.sequence.push(name);
            if (!Chain.exists(name)) {
                return new Chain(name, function () {}, this.sequence);
            }
            return this;
        }
    }, {
        key: 'reduce',
        value: function reduce(field) {
            this.reducer = field;
            return this;
        }
    }, {
        key: 'spec',
        value: function spec(field) {
            var json = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var spec = new _spec2.default(field);
            if (json.require) {
                spec.require(json.require, json.requireMessage);
            }
            if (json.default) {
                spec.default(json.default);
            }
            if (json.validate) {
                spec.validate(json.validate);
            }
            if (json.transform) {
                spec.transform(json.transform);
            }
            if (json.translate) {
                spec.translate(json.translate);
            }
            this.specs.push(spec);
            return this;
        }
    }, {
        key: 'strict',
        value: function strict() {
            this.isStrict = true;
            return this;
        }
    }, {
        key: 'onStart',
        value: function onStart(action) {
            this.action = action;
            return this;
        }
    }, {
        key: 'onBefore',
        value: function onBefore(onbefore) {
            this.onbefore = onbefore;
            return this;
        }
    }, {
        key: 'onFail',
        value: function onFail(_onFail) {
            this.onfail = _onFail;
            return this;
        }
    }, {
        key: 'cache',
        value: function cache(cachedLast) {
            this.cachedLast = cachedLast || 1500;
            return this;
        }
    }, {
        key: 'execute',
        value: function execute(param) {
            return Chain.start(this.sequence || this.name, param);
        }
    }], [{
        key: 'start',
        value: function start(chains) {
            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return new _executer.Executer().start(param, chains);
        }
    }, {
        key: 'create',
        value: function create(name) {
            return new Chain(name);
        }
    }, {
        key: 'exists',
        value: function exists(name) {
            return (0, _storage.isExists)(name);
        }
    }, {
        key: 'config',
        value: function config(props) {
            _configurator2.default.configure(props);
        }
    }]);

    return Chain;
}();

exports.Chain = Chain;