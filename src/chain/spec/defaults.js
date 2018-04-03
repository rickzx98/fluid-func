export class Defaults {
    constructor(field, specData, context, SpecFailedException) {
        this.field = field;
        this.specData = specData;
        this.context = context;
        this.SpecFailedException = SpecFailedException;
    }

    runDefault() {
        const { defaultValue } = this.specData;
        return new Promise((resolve, reject) => {
            new this.SpecFailedException(() => {
                try {
                    this.context.set(this.field, defaultValue);
                    resolve();
                } catch (err) {
                    reject({ error: err, field: this.field });
                }
            }, this.field, reject);
        });
    }
}