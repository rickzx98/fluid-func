"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var logError = exports.logError = function logError(createLog, chain, error) {
    return createLog(chain, error.message, error);
};