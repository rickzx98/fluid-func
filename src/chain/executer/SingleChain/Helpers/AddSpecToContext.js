export default class AddSpecToContext {
    constructor(specs, context) {
        if (specs) {
            specs.forEach(spec => {
                context.addSpec(spec);
            });
        }
    }
}