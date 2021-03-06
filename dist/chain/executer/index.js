'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Executer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = require('../storage/');

var _plugins = require('../plugins/');

var _logger = require('../logger/');

var _arrayChain = require('./array-chain');

var _context = require('../context/');

var _context2 = _interopRequireDefault(_context);

var _reducer = require('./reducer');

var _runner = require('./runner');

var _StartChain = require('./SingleChain/StartChain');

var _StartChain2 = _interopRequireDefault(_StartChain);

var _util = require('./util');

var _cache = require('../cache/');

var _Util = require('../Util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Executer = exports.Executer = function () {
    function Executer() {
        _classCallCheck(this, Executer);
    }

    _createClass(Executer, [{
        key: 'start',
        value: function start(param, chains) {
            return new _runner.Runner(_storage.getChain, _Util.generateUUID, _context2.default, _StartChain2.default, _arrayChain.ArrayChain, _reducer.Reducer, _util.Util, _storage.createExecutionStack, _storage.addChainToStack, _storage.deleteStack, _cache.cache, _logger.logInfo, _logger.logError, _plugins.executeAfter, _plugins.executeBefore).start(param, chains);
        }
    }]);

    return Executer;
}();