import {createLog} from './Log';
import {logError as _logError} from './error';
import {logInfo as _logInfo} from './info';
import {getLogMonitor } from '../storage';

export const logError = (chain, error) => {
    getLogMonitor()(_logError(createLog, chain, error));
};

export const logInfo = (chain, message) => {
    getLogMonitor()(_logInfo(createLog, chain, message));
};