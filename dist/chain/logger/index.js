'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logInfo = exports.logError = undefined;

var _Log = require('./Log');

var _error = require('./error');

var _info = require('./info');

var _storage = require('../storage');

var logError = exports.logError = function logError(chain, error) {
    (0, _storage.getLogMonitor)()((0, _error.logError)(_Log.createLog, chain, error));
};

var logInfo = exports.logInfo = function logInfo(chain, message) {
    (0, _storage.getLogMonitor)()((0, _info.logInfo)(_Log.createLog, chain, message));
};