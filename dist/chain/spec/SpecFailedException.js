'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SpecFailedException = exports.SpecFailedException = function SpecFailedException(procedure, field, reject) {
    _classCallCheck(this, SpecFailedException);

    try {
        procedure();
    } catch (error) {
        console.log('error', error);
        if (reject) {
            reject({
                field: field,
                error: error
            });
        } else {
            throw new Error('SpecFailedException: ' + error.message);
        }
    }
};