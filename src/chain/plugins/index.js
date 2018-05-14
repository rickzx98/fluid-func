import { executeAfterPlugins } from './after';
import { executeBeforePlugins } from './before';
import { getPlugins } from '../storage';

export const executeBefore = (chain, context) => {
    return executeBeforePlugins(chain, context, getPlugins());
}
export const executeAfter = (chain, context) => {
    return executeAfterPlugins(chain, context, getPlugins());
}