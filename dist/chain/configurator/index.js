'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = require('../storage/');

var _getLogger = require('./getLogger');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Configutrator = function () {
    function Configutrator() {
        _classCallCheck(this, Configutrator);
    }

    _createClass(Configutrator, null, [{
        key: 'configure',
        value: function configure(props) {
            var config = {};
            (0, _getLogger.getLogger)(config, props);
            (0, _storage.setChainConfig)(config);
        }
    }]);

    return Configutrator;
}();

exports.default = Configutrator;