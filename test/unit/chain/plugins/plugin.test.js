import 'babel-polyfill';

import { executeAfter, executeBefore } from '../../../../src/chain/plugins/';

import Configurator from '../../../../src/chain/configurator';
import Context from '../../../../src/chain/context';
import { expect } from 'chai';

describe('plugin.unit.test', () => {
    it('should resolve even before is missing', done => {
        executeBefore('chain1', {})
            .then(resolve => {
                done();
            });
    });
    it('should resolve even after is missing', done => {
        executeAfter('chain1', {})
            .then(resolve => {
                done();
            });
    });
    it('should run before plugins', done => {
        Configurator.configure({
            plugins: [
                {
                    name: 'samplePlugin',
                    action: () => ({
                        hello: 'world!'
                    }),
                    before: ['chain1']
                },
                {
                    name: 'samplePlugin2',
                    action: () => new Promise((resolve) => {
                        resolve({ hi: 'hello!' });
                    }),
                    before: ['chain1']
                }
            ]
        })
        const ctx = new Context('chain1');
        executeBefore('chain1', ctx)
            .then(resolve => {
                expect(resolve.samplePlugin.hello).to.be.equal('world!');
                expect(resolve.samplePlugin2.hi).to.be.equal('hello!');
                done();
            });
    });
    it('should run after plugins', done => {
        Configurator.configure({
            plugins: [
                {
                    name: 'samplePlugin',
                    action: () => ({
                        hello: 'world!'
                    }),
                    after: ['chain1']
                },
                {
                    name: 'samplePlugin2',
                    action: () => new Promise((resolve) => {
                        resolve({ hi: 'hello!' });
                    }),
                    after: ['chain1']
                }
            ]
        })
        const ctx = new Context('chain1');
        executeBefore('chain1', ctx)
            .then(resolve => {
                expect(resolve.samplePlugin.hello).to.be.equal('world!');
                expect(resolve.samplePlugin2.hi).to.be.equal('hello!');
                done();
            });

    });
});