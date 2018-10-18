export default class ConvertParamFromSpec {
    constructor(param, chainInstance) {
        let newParam = param;
        if (!!chainInstance.isStrict) {
            newParam = {};
            if (chainInstance.specs) {
                chainInstance.specs.forEach(spec => {
                    newParam[spec.field] = param[spec.field];
                });
            }
        }
        this.getParam = () => newParam;
    }
}