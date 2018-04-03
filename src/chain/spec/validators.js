export class Validators {
    constructor(field, context, specData, SpecFailedException) {
        this.field = field;
        this.context = context;
        this.specData = specData;
        this.SpecFailedException = SpecFailedException;
    }

    runRequireValidation() {
        const { require, requireMessage } = this.specData;
        const isRequired = (require instanceof Function && require()) || require;
        return new Promise((resolve, reject) => {
            new this.SpecFailedException(() => {
                const contextData = this.context.getData();
                if (isRequired && (!contextData[this.field] || contextData[this.field]() === '')) {
                    reject({
                        field: this.field,
                        error: new Error(requireMessage || `Field ${this.field} is required.`)
                    });
                }
                else {
                    resolve();
                }
            }, this.field, reject);

        });
    }

    runValidation() {
        const { validator } = this.specData;
        return new Promise((resolve, reject) => {
            new this.SpecFailedException(() => {
                const contextData = this.context.getData();
                if (validator) {
                    validator(contextData[this.field] ? contextData[this.field]() : undefined).then(() => {
                        resolve();
                    }).catch(error => {
                        reject({
                            field: this.field,
                            error: error
                        });
                    });
                }
                else {
                    resolve();
                }
            }, this.field, reject);
        });
    }
}