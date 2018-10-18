export default class AddInitialParam {
    constructor(initialParam, context) {
        Object.keys(initialParam).forEach(field => {
            if (field !== "$chainId" && field !== "$$$validators") {
                context.set(field, initialParam[field]());
            }
        });
    }
}