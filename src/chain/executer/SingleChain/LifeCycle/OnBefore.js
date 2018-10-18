export default class OnBefore {
    constructor(chain, param, resolve, reject, Context, next) {
        try {
            const onbefore = chain.onbefore(param);
            if (onbefore instanceof Promise) {
                onbefore.then(con => {
                    if (con) {
                        next();
                    } else {
                        resolve(Context.createContext(chain.$chainId).getData());
                    }
                }).catch(err => {
                    reject(err);
                })
            } else if (onbefore) {
                next();
            } else {
                resolve(Context.createContext(chain.$chainId).getData());
            }
        } catch (err) {
            reject(err);
        }
    }
}