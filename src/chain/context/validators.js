const VALIDATORS = '$$$validators';
export class Validators {
    constructor(chainId, getChainContext, CollectPromiseResult) {
        const validators = getChainContext(chainId, VALIDATORS);
        this.fieldSpecs = validators ? validators() : [];
        this.CollectPromiseResult = CollectPromiseResult;
    }
    addSpec(fieldSpec, setChainContextValue) {
        const validators = Object.assign([], [...this.fieldSpecs, fieldSpec]);
        setChainContextValue(VALIDATORS, validators);
    }

    runValidations(context) {
        const validators = this.fieldSpecs.map(validator => validator.runValidation(context));
        return new Promise((resolve, reject) => {
            new this.CollectPromiseResult(validators)
                .collect((result) => {
                    if (result.error && result.error.length > 0) {
                        reject(result.error);
                    } else {
                        resolve();
                    }
                })
        });
    }

    runSpecs(context) {
        const validators = this.fieldSpecs
            .map(validator => {
                const promises = validator.actions.map(
                    action => {
                        switch (action) {
                            case 'require':
                                return validator.runRequireValidation(context);
                            case 'validate':
                                return validator.runValidation(context);
                            case 'default':
                                return validator.runDefault(context);
                            case 'transform':
                                return validator.runTransform(context);
                            case 'translate':
                                return validator.runTranslate(context);
                        }
                    }
                );
                return Promise.all(promises);
            });
        return new Promise((resolve, reject) => {
            new this.CollectPromiseResult(validators)
                .collect((result) => {
                    if (result.error && result.error.length > 0) {
                        reject(result.error);
                    } else {
                        resolve();
                    }
                })
        });
    }

}