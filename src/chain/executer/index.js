import { addChainToStack, createExecutionStack, deleteStack, getChain } from '../storage/';

import { ArrayChain } from './array-chain';
import Context from '../context/';
import { Reducer } from './reducer';
import { Runner } from './runner';
import { SingleChain } from './single-chain';
import { Util } from './util';
import { cache } from '../cache/';
import { generateUUID } from '../Util';

export class Executer {
    start(param, chains) {
        return new Runner(getChain, generateUUID, Context,
            SingleChain, ArrayChain,
            Reducer, Util,
            createExecutionStack,
            addChainToStack,
            deleteStack,
            cache).start(param, chains);
    }
}