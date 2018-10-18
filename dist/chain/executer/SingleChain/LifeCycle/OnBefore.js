"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OnBefore = function OnBefore(chain, param, resolve, reject, Context, next) {
    _classCallCheck(this, OnBefore);

    try {
        var onbefore = chain.onbefore(param);
        if (onbefore instanceof Promise) {
            onbefore.then(function (con) {
                if (con) {
                    next();
                } else {
                    resolve(Context.createContext(chain.$chainId).getData());
                }
            }).catch(function (err) {
                reject(err);
            });
        } else if (onbefore) {
            next();
        } else {
            resolve(Context.createContext(chain.$chainId).getData());
        }
    } catch (err) {
        reject(err);
    }
};

exports.default = OnBefore;