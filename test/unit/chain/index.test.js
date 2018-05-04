import 'babel-polyfill';

import {Chain} from '../../../src/chain/';
import chai from 'chai';

const expect = chai.expect;

describe('Chain unit test', () => {
    it('should not be allowed to start if name is undefined', () => {
        expect(Chain.start(undefined)).to.be.undefined;
    });
    it('should allow function w/out parameter in spec.require', done => {
        function innerClass() {
            let sampleClass = {};
            sampleClass.innerHello = 'Hi';
            sampleClass.isRequired = function () {
                let result = sampleClass.innerHello === 'Hi';
                return result;
            }
            new Chain('RequireSampleChain', (param) => {

            }).spec('sample', {
                require: sampleClass.isRequired
            });
            return sampleClass;
        }

        let inner = innerClass();

        inner.innerHello = 'hello';
        new Chain('RequireSampleChain1', () => {
        });
        Chain.start(['RequireSampleChain1', 'RequireSampleChain'])
            .then((result) => {
                done();
            })
            .catch(error => {
                expect(error.error.message).to.be.equal('Field sample is required.');
                done();
            });
    });
    it('get the field specified in result function', () => {
        new Chain('FieldChainSample1', (parameters) => {
            const hello = parameters.takeThat('hello');
            expect(hello).to.be.equal('hello');
            return {
                takeThis: {
                    hello
                }
            };
        });
        Chain.start('FieldChainSample1', {
            takeThat: {
                hello: 'hello'
            }
        }).then(result => {
            expect(result.takeThis('hello')).to.be.equal('hello');
        }).catch(error => {
            console.error(error);
        });
    });
    it('executes chain', done => {
        new Chain('SampleChain1', (parameter) => {
            let context = {};
            context.hello = 'world!';
            context.fromParam = parameter.hi();
            return context;
        });

        Chain.start('SampleChain1', {hi: 'initParam'})
            .then(result => {
                expect(result.hello()).to.be.equal('world!');
                expect(result.fromParam()).to.be.equal('initParam');
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
    });
    it('checks if chain already exists', () => {
        new Chain('ExistingChain', () => {
        });
        expect(Chain.exists('ExistingChain')).to.be.true;
    });
    it('executes chain asynchronously', done => {
        new Chain('SampleChain2', (parameter) => {
            let context = {};
            context.hello = 'world!';
            context.fromParam = parameter.hi();
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(context);
                });
            });
        });

        Chain.start('SampleChain2', {hi: 'initParam'})
            .then(result => {
                expect(result.hello()).to.be.equal('world!');
                expect(result.fromParam()).to.be.equal('initParam');
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
    });

    it('executes chain that return string literals', done => {
        new Chain('SampleChain3', (parameter) => {
            return 'hello';
        });
        Chain.start('SampleChain3')
            .then(result => {
                expect(result.value).to.be.not.undefined;
                expect(result.value()).to.be.equal('hello');
                done();
            });
    });

    it('executes multiple chains', done => {
        new Chain('SampleChain4', (parameter) => {
            return {
                _1st: '1st'
            };
        });
        new Chain('SampleChain5', (parameter) => {
            return parameter._1st() + ' - 2nd';
        });
        new Chain('SampleChain6', (parameter) => {
            return {
                _3rd: parameter.value() + ' - 3rd'
            };
        });

        Chain.start(['SampleChain4', 'SampleChain5', 'SampleChain6'])
            .then(result => {
                expect(result._3rd()).to.be.equal('1st - 2nd - 3rd');
                done();
            }).catch(() => {
            done();
        });
    });

    it('executes chain with reducer', done => {
        new Chain('SampleChainReducer', (parameter, current) => {
            return current + (parameter.value ? parameter.value() : 0);
        }).reduce('sampleArray');

        Chain.start('SampleChainReducer', {sampleArray: [1, 2, 3, 4, 5]})
            .then(result => {
                expect(result.value()).to.be.equal(15);
                done();
            })
            .catch(err => console.log);
    });

    it('executes multiple chains with reducer', done => {
        new Chain('SampleChainReducer1', (parameter, current) => {
            return current + (parameter.value ? parameter.value() : 0);
        }).reduce('sampleArray');
        new Chain('SampleChain7', (parameter) => {
            return {sum: 5 + parameter.value()};
        });
        Chain.start(['SampleChainReducer1', 'SampleChain7'], {sampleArray: [1, 2, 3, 4, 5]})
            .then(result => {
                expect(result.sum()).to.be.equal(20);
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
    });

    it('should executes chain with strict mode on', done => {
        new Chain('SampleChain8', (parameter) => {
            expect(parameter.sample).to.be.not.undefined;
            expect(parameter.hello).to.be.undefined;
        }).spec('sample', {
            require: true
        }).strict();
        Chain.start('SampleChain8', {
            sample: 'sample',
            hello: 'hello'
        }).then(() => {
            done();
        }).catch(err => {
            console.log(err);
            done();
        });
    });

    it('should executes chain with transform spec', done => {
        new Chain('SampleChain9', (parameter) => {
            expect(parameter.sample()).to.be.equal('hello');
        }).spec('sample', {
            transform: () => {
                return new Promise((resolve) => {
                    resolve('hello');
                });
            }
        });
        Chain.start('SampleChain9', {
            sample: 'sample'
        }).then(() => {
            done();
        }).catch(err => {
            console.log(err);
            done();
        });
    });

    it('should execute chain with translate spec', done => {
        new Chain('SampleChain10', (parameter) => {
            expect(parameter.something()).to.be.equal('sweet');
        }).spec('sample', {
            translate: (value, context) => {
                return new Promise((resolve) => {
                    expect(value).to.be.equal('sample');
                    context.set('something', 'sweet');
                    resolve();
                });
            }
        });
        Chain.start('SampleChain10', {
            sample: 'sample'
        }).then(() => {
            done();
        }).catch(err => {
            console.log(err);
            done();
        });
    });

    it('should executes chain with custom validator', done => {
        new Chain('SampleChain11', (parameter) => {
            expect(parameter.sample()).to.be.equal('sample');
        }).spec('sample', {
            validate: (value) => {
                return new Promise((resolve) => {
                    resolve(value === 'sample');
                });
            }
        });
        Chain.start('SampleChain11', {
            sample: 'sample'
        });

        new Chain('SampleChain12', (parameter) => {
            expect(parameter.sample).to.be.undefined;
        }).spec('sample', {
            validate: (value) => {
                return new Promise((resolve, reject) => {
                    if (value !== 'sample') {
                        reject(new Error('Value should be sample'));
                    }
                });
            }
        }).spec('sample2', {require: true});
        Chain.start('SampleChain12', {value: 'false'}).catch(status => {
            expect(status.error.length).to.be.equal(2);
            expect(status.error[0].field).to.be.equal('sample');
            expect(status.error[0].error.message).to.be.equal('Value should be sample');
            expect(status.error[1].field).to.be.equal('sample2');
            expect(status.error[1].error.message).to.be.equal('Field sample2 is required.');
            done();
        });
    });
    it('should handle require as function', done => {
        new Chain('RequireTestChain', () => {

        }).spec('sample1', {
            require: true
        });

        Chain.start('RequireTestChain')
            .catch(stack => {
                console.log('stack.error.func', stack.error.func);
                expect(stack.error[0].field).to.be.equal('sample1');
                expect(stack.error.func).to.be.equal('RequireTestChain');
            });

        new Chain('RequireTestChain2', () => {

        }).spec('sample2', {
            require: () => false
        });
        Chain.start('RequireTestChain2')
            .then(() => {
                done();
            })
            .catch(stack => {
                console.log('statc', stack);
            });
    });
    it('should run onStart function before starting a chain', done => {
        let ifIStarted = false;
        Chain
            .create('SampleChain13')
            .onStart((param) => {
                return {
                    status: 'I ran'
                };
            })
            .onBefore((param) => {
                ifIStarted = true;
                return true;
            })
            .connect('SampleChain14')
            .onStart(() => 'I ran 14')
            .onBefore(() => {
                ifIStarted = false;
                return false;
            })
            .execute()
            .then((result) => {
                expect(ifIStarted).to.be.false;
                done();
            }).catch(err => {
            console.log(err);
            done();
        });
    });

    it('should trigger onFail function is a chain has failed', done => {
        Chain.create('SampleChain15')
            .onStart(() => {
                throw new Error('I failed');
            })
            .onFail((error, retry, reject) => {
                expect(error.message).to.be.equal('I failed');
                reject();
            })
            .execute()
            .catch(err => {
                done();
            });
    });
    it('should retry when chain has failed', done => {
        let retried = false;
        Chain.create('SampleChain16')
            .onStart(() => {
                if (!retried) {
                    throw new Error('I failed');
                } else {
                    return 'done';
                }
            })
            .onFail((error, retry) => {
                retried = true;
                console.log('retried', retried);
                retry();
            })
            .execute()
            .then(result => {
                expect(result.value()).to.be.equal('done');
                done();
            }).catch(err => console.log);
    });

    it('should cache chain action', done => {
        let counter = 0;
        Chain.create('SampleChain17')
            .onStart(() => {
                counter++;
                return '17';
            })
            .spec('hello')
            .strict()
            .cache();

        Chain.create('SampleChain18')
            .onStart(() => {
                counter++;
                return '18';
            })
            .spec('hello')
            .strict()
            .cache(5000);

        Chain.start(['SampleChain17', 'SampleChain18', 'SampleChain17', 'SampleChain18'], {
            hello: 'hello'
        }).then(result => {
            expect(counter).to.be.equal(2);
            done();
        }).catch(console.log);
    });

    it('should cache chain action for a specific time', done => {
        let counter = 0;
        Chain.create('SampleChain19')
            .onStart(() => {
                counter++;
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve('19');
                    }, 501);
                })
            })
            .spec('hello')
            .strict();

        Chain.create('SampleChain20')
            .onStart(() => {
                counter++;
                return '18';
            })
            .spec('hello')
            .strict()
            .cache(500);

        Chain.start(['SampleChain19', 'SampleChain20', 'SampleChain19', 'SampleChain20'], {
            hello: 'hello'
        }).then(result => {
            expect(counter).to.be.equal(4);
            done();
        }).catch(console.log);
    });
});
