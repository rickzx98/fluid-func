import { addChainToStack, createExecutionStack, deleteStack, getChain } from '../storage/';
import { executeAfter, executeBefore } from '../plugins/';
import { logError, logInfo } from '../logger/';

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
            cache, logInfo, logError,
            executeAfter, executeBefore).start(param, chains);
    }
}