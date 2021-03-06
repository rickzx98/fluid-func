const PUT_CHAIN_METHOD = 'PLUGIN_PUT_CHAIN';
const PUT_CHAIN_CONTEXT_METHOD = 'PLUGIN_PUT_CHAIN_CONTEXT';
/**
 * Put chain to the storage
 * @param {*} storage
 * @param {function} exists
 * @param {*} name
 * @param {*} chain
 */
export const putChain = (storage, exists, name, chain) => {
    if (exists(name)) {
        throw ChainWithTheSameNameException(name);
    }
    if (storage[PUT_CHAIN_METHOD]) {
        storage[PUT_CHAIN_METHOD](name, chain);
    } else {
        storage[name] = Object.assign(chain, { func: name });
    }
};

/**
 * Put chain context value to storage
 * @param {*} storage
 * @param {*} chainId
 * @param {*} context
 * @param {*} field
 * @param {*} value
 */
export const putChainContext = (storage, chainId, field, value) => {
    if (storage[PUT_CHAIN_CONTEXT_METHOD]) {
        storage[PUT_CHAIN_CONTEXT_METHOD](chainId, field, () => value);
    } else {
        if (!storage[chainId]) {
            storage[chainId] = {};
        }
        const frozenValue = (field) => {
            let newValue = value;
            if (field !== undefined && value !== undefined) {
                newValue = value[field];
            }
            if (newValue !== undefined) {
                return Object.freeze(newValue);
            }
        };
        storage[chainId][field] = frozenValue ? frozenValue.bind(storage[chainId]) : undefined;
    }
};

/**
 * Overrides the put chain function
 * @param {*} storage
 * @param {*} plugin
 */
export const setPutChainPlugin = (storage, plugin) => {
    if (!(plugin instanceof Function)) {
        throw new PutChainTypeException();
    }
    storage[PUT_CHAIN_METHOD] = plugin;
};


export const setChainConfig = (chainConfig, storage, config) => {
    storage[chainConfig] = config;
};

/**
 * Overrides the put chain context function
 * @param {*} storage
 * @param {*} plugin
 */
export const setPutChainContextPlugin = (storage, plugin) => {
    if (!(plugin instanceof Function)) {
        throw new PutChainTypeException();
    }
    storage[PUT_CHAIN_CONTEXT_METHOD] = plugin;
};


class PutChainTypeException extends Error {
    constructor() {
        super('Put chain plugin must be a function.');
    }
}

class ChainWithTheSameNameException extends Error {
    constructor(name) {
        super('A chain with the same name as "' + name + '" has already been stored.');
    }
}

