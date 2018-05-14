import 'babel-polyfill';

import { expect } from 'chai';
import { getPlugins } from '../../../../src/chain/configurator/getPlugins';

describe('configurator.unit.test', () => {

    it('throws an error when plugin is missing .name', () => {
        expect(() => {
            getPlugins({}, {
                plugins: [{}]
            });
        }).to.throw('plugin must have .name');
    });

    it('throw error when plugin is missing action', () => {
        expect(() => {
            getPlugins({}, {
                plugins: [{
                    name: 'Sample'
                }]
            });
        }).to.throw('plugin must have .action function');
    });

    it('throw error when plugin is missing before or after chains', () => {
        expect(() => {
            getPlugins({}, {
                plugins: [{
                    name: 'Sample',
                    action: () => { }
                }]
            });
        }).to.throw('plugin must have alteast one .before or .after array');
    });

    it('should create before chain plugins', () => {
        const config = {};
        let counter = 0;
        getPlugins(config, {
            plugins: [{
                name: 'Sample',
                action: () => {
                    counter++;
                },
                before: ['chain1', 'chain2', 'chain3']
            }]
        });
        expect(config.plugins).to.be.not.undefined;
        Object.keys(config.plugins).filter(key => key.indexOf('before') > -1).forEach(key => {
            config.plugins[key][0].action();
        });
        expect(counter).to.be.equal(3);
    });

    it('should create after chain plugins', () => {
        const config = {};
        let counter = 0;
        getPlugins(config, {
            plugins: [{
                name: 'Sample',
                action: () => {
                    counter++;
                },
                after: ['chain1', 'chain2', 'chain3']
            }]
        });
        expect(config.plugins).to.be.not.undefined;
        Object.keys(config.plugins).filter(key => key.indexOf('after') > -1).forEach(key => {
            config.plugins[key][0].action();
        });
        expect(counter).to.be.equal(3);
    });

    it('should extends existing plugins', () => {
        const config = {};
        let plugins = {
            'before_everything': [{
                name: 'sample',
                action: () => { }
            }]
        };
        getPlugins(config, {
            plugins: [{
                name: 'sample',
                action: () => { },
                before: ['everything', 'everything2'],
                after: ['everything']
            }, {
                name: 'sample2',
                action: () => { },
                before: ['everything']
            }]
        }, plugins);
        expect(config.plugins.after_everything).to.be.not.undefined;
        expect(config.plugins.before_everything).to.be.not.undefined;
        expect(config.plugins.before_everything2).to.be.not.undefined;

        expect(config.plugins.after_everything.length).to.be.equal(1);
        expect(config.plugins.before_everything.length).to.be.equal(3);
        expect(config.plugins.before_everything2.length).to.be.equal(1);
    });

});
