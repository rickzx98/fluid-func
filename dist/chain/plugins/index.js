'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.executeAfter = exports.executeBefore = undefined;

var _after = require('./after');

var _before = require('./before');

var _storage = require('../storage');

var executeBefore = exports.executeBefore = function executeBefore(chain, context) {
    return (0, _before.executeBeforePlugins)(chain, context, (0, _storage.getPlugins)());
};
var executeAfter = exports.executeAfter = function executeAfter(chain, context) {
    return (0, _after.executeAfterPlugins)(chain, context, (0, _storage.getPlugins)());
};