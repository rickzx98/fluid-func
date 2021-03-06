import { Defaults } from './defaults'
import { SpecFailedException } from './SpecFailedException';
import { Transformer } from './transformer';
import { Translator } from './translator';
import { Validators } from './validators';

export default class Spec {
    constructor(field) {
        this.field = field;
        this.actions = [];
        this.data = {};
        classValidation(this);
    }

    default(defaultValue) {
        addAction(this, 'default');
        this.data = { ...this.data, defaultValue };
    }

    require(require, requireMessage) {
        addAction(this, 'require');
        this.data = { ...this.data, require: require, requireMessage };
    }

    validate(validator = (currentValue) => new Promise()) {
        addAction(this, 'validate');
        this.data = { ...this.data, validator };
    }

    transform(transformer = (currentValue) => new Promise()) {
        addAction(this, 'transform');
        this.data = { ...this.data, transformer };
    }

    translate(translator = (currentValue, context) => new Promise()) {
        addAction(this, 'translate');
        this.data = { ...this.data, translator };
    }

    runValidation(context) {
        return new Validators(this.field, context, this.data, SpecFailedException).runValidation();
    }

    runRequireValidation(context) {
        return new Validators(this.field, context, this.data, SpecFailedException).runRequireValidation();
    }

    runDefault(context) {
        return new Defaults(this.field, this.data, context, SpecFailedException).runDefault();
    }

    runTransform(context) {
        return new Transformer(this.field, this.data, context, SpecFailedException).runTransform();
    }

    runTranslate(context) {
        return new Translator(this.field, this.data, context, SpecFailedException).runTranslate();
    }
}

function addAction(spec, actionName) {
    spec.actions.push(actionName);
}
function classValidation(spec) {
    if (!spec.field) {
        throw new Error('Field name is required.');
    }
}