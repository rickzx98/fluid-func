export class Transformer {
    constructor(field, specData, context, SpecFailedException) {
        this.field = field;
        this.specData = specData;
        this.context = context;
        this.SpecFailedException = SpecFailedException;
    }

    runTransform() {
        return new Promise((resolve, reject) => {
            new this.SpecFailedException(() => {
                const { transformer } = this.specData;
                if (transformer) {
                    const contextData = this.context.getData();
                    if (contextData[this.field]) {
                        transformer(contextData[this.field]())
                            .then(newValue => {
                                this.context.set(this.field, newValue);
                                resolve();
                            }).catch(error => { reject({ field: this.field, error }); });
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            }, this.field, reject);
        });
    }
}