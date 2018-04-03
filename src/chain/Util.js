export const generateUUID = () => {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
export const batchIn = (object, next, done) => {
    const keys = Object.keys(object);
    batchForObject(keys, object, next, done);
}
function batchForObject(keys, object, next, done, index = 0) {
    if (index < keys.length) {
        let value = object[keys[index]];
        next(value, () => {
            batchForObject(keys, object, next, done, ++index);
        });
    } else {
        done();
    }
}
export const batch = (array, next, done, index = 0) => {
    if (index < array.length) {
        let value = array[index];
        next(value, () => {
            batch(array, next, done, ++index);
        });
    } else {
        done();
    }

}

export function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

export class CollectPromiseResult {
    constructor(promises) {
        this.promises = promises;
    }
    collect(callback, results = []) {
        if (this.promises.length > 0) {
            const promise = this.promises.shift();
            promise
                .then(data => {
                    results.push({ success: true, data });
                    new CollectPromiseResult(this.promises).collect(callback, results);
                })
                .catch(error => {
                    results.push({ failed: true, error });
                    new CollectPromiseResult(this.promises).collect(callback, results);
                });
        } else {
            const error = results.filter(result => result.failed).map(result => result.error);
            const success = results.filter(result => result.success).map(result => result.data);
            callback({
                error,
                success
            });
        }
    }
}