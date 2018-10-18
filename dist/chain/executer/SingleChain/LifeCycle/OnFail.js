'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OnFail = function OnFail(chain, error, resolve, reject, singleChain, initialParam, chains, logInfo, logError) {
    _classCallCheck(this, OnFail);

    error = Object.assign(error, { func: chain.func });
    logError('SingleChain', error);
    logInfo('SingleChain', {
        chain: chains,
        message: 'Failed to complete',
        params: initialParam
    });
    if (chain.onfail) {
        chain.onfail(error, function () {
            singleChain.start(initialParam, chains).then(function (result) {
                resolve(result);
            }).catch(function (err) {
                reject(err);
            });
        }, function () {
            reject(error);
        });
    } else {
        reject(error);
    }
};

exports.default = OnFail;