"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createLog = exports.createLog = function createLog(source, message, error) {
    return {
        source: source,
        message: message,
        error: error
    };
};