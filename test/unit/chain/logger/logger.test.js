import 'babel-polyfill';
import {logInfo, logError} from '../../../../src/chain/logger';
import Chain from '../../../../src/';
import {expect} from 'chai';


describe('logger.unit.test', () => {
    it('should log info', () => {
        Chain.config({
            logMonitor: (monitor) => {
                expect(monitor.source).to.be.equal('sampleChain');
                expect(monitor.message).to.be.equal('first log');
            }
        });
        logInfo('sampleChain', 'first log');
    });

    it('should log error', () => {
        Chain.config({
            logMonitor: (monitor) => {
                expect(monitor.source).to.be.equal('sampleChain');
                expect(monitor.message).to.be.equal('first error');
            }
        });
        try {
            throw new Error('first error');
        } catch (error) {
            logError('sampleChain', error);
        }
    });
});
