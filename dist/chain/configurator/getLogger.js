'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getLogger = exports.getLogger = function getLogger(config, props) {
    var logMonitor = function logMonitor() {
        return false;
    };
    if (props.logMonitor) {
        if (props.logMonitor instanceof Function) {
            logMonitor = props.logMonitor;
        } else {
            throw new Error('logMonitor must be a Function');
        }
    }
    config.logMonitor = logMonitor;
};