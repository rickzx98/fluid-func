import 'babel-polyfill';

import {
    getChain,
    getChainContext,
    getLogMonitor,
    getPlugins,
    putChain,
    putChainContext,
    setChainConfig,
    setGetChainContextPlugin,
    setGetChainPlugin,
    setPutChainContextPlugin,
    setPutChainPlugin
} from '../../../../src/chain/storage/';

import { expect } from 'chai';

describe('storage.unit.test', () => {
    it('should put chain config', () => {
        setChainConfig({
            logMonitor: () => true,
            plugins: { name: 'sample' }
        });
        expect(getPlugins()).to.be.not.undefined;
        expect(getPlugins().name).to.be.equal('sample');
        expect(getLogMonitor()()).to.be.true;
    })
    it('should put and get chain in storage', () => {
        putChain('storageTest.chain000', {
            execute: () => {
            }
        });
        const chain = getChain('storageTest.chain000');
        expect(chain).to.be.not.undefined;
        expect(chain.$chainId).to.be.not.undefined;
    });

    it('should put and get chain context in storage', () => {
        putChain('storageTest.chain001', {});
        const chain = getChain('storageTest.chain001');
        const chainId = chain.$chainId;
        putChainContext(chainId, 'sampleField', 'sampleValue');
        const context = getChainContext(chainId, 'sampleField');
        expect(context).to.not.undefined;
        expect(context()).to.be.equal('sampleValue');
    });

});