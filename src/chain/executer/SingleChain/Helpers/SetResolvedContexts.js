export default class SetResolvedContexts {
    constructor(resolvedContext, context) {
        if (resolvedContext) {
            for (let field in resolvedContext) {
                if (resolvedContext.hasOwnProperty(field)) {
                    const fieldData = resolvedContext[field];
                    context.set(field, fieldData);
                }
            }
        }
    }
}