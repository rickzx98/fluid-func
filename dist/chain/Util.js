'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.isValidJson = isValidJson;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var generateUUID = exports.generateUUID = function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
};
var batchIn = exports.batchIn = function batchIn(object, next, done) {
    var keys = Object.keys(object);
    batchForObject(keys, object, next, done);
};
function batchForObject(keys, object, next, done) {
    var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    if (index < keys.length) {
        var value = object[keys[index]];
        next(value, function () {
            batchForObject(keys, object, next, done, ++index);
        });
    } else {
        done();
    }
}
var batch = exports.batch = function batch(array, next, done) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (index < array.length) {
        var value = array[index];
        next(value, function () {
            batch(array, next, done, ++index);
        });
    } else {
        done();
    }
};

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

var CollectPromiseResult = exports.CollectPromiseResult = function () {
    function CollectPromiseResult(promises) {
        _classCallCheck(this, CollectPromiseResult);

        this.promises = promises;
    }

    _createClass(CollectPromiseResult, [{
        key: 'collect',
        value: function collect(callback) {
            var _this = this;

            var results = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            if (this.promises.length > 0) {
                var promise = this.promises.shift();
                promise.then(function (data) {
                    results.push({ success: true, data: data });
                    new CollectPromiseResult(_this.promises).collect(callback, results);
                }).catch(function (error) {
                    results.push({ failed: true, error: error });
                    new CollectPromiseResult(_this.promises).collect(callback, results);
                });
            } else {
                var error = results.filter(function (result) {
                    return result.failed;
                }).map(function (result) {
                    return result.error;
                });
                var success = results.filter(function (result) {
                    return result.success;
                }).map(function (result) {
                    return result.data;
                });
                callback({
                    error: error,
                    success: success
                });
            }
        }
    }]);

    return CollectPromiseResult;
}();