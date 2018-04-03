export class SpecFailedException {
    constructor(procedure, field, reject) {
        try {
            procedure();
        } catch (error) {
            console.log('error', error);
            if (reject) {
                reject({
                    field,
                    error
                });
            } else {
                throw new Error('SpecFailedException: ' + error.message);
            }
        }
    }
}