# fluid-func

A way to write your code with functional programming in mind

[![NPM Download Stats](https://nodei.co/npm/fluid-func.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/fluid-func)

## Getting started

- Installation

```bash
    npm install --save fluid-func
```

- Javascript (ES6)

```javascript
    import FluidFunc from 'fluid-func';
```

- Javascsript 

```javascript
   var FluidFunc = require('fluid-func');
```

Note: This package is basically a fork of [fluid-chains](https://github.com/rickzx98/fluid-chains) with lighter packaging, less dependencies, a more secure aproach to chaining functions and focused on functional programming.

### Two ways to create a Func

```javascript
    new FluidFunc('_1stFunc', function(parameter){
        // do some work here
    });
```

```javascript
    FluidFunc.create('_1stFunc')
        .onStart(function(paramater){
            //do some work here
        });
```

### Two ways to start a Func

```javascript
    FluidFunc.start('_1stFunc', {paramName:'paramVAlue'})
        .then(function(result){
            // do some work after
        })
        .catch(function(err){
            // do some error handling
        });
```

```javascript
    FluidFunc.create('_1stFunc')
        .onStart(function(paramater){
            //do some work here
        }).execute({paramName:'paramVAlue'})
        .then(function(result){
            // do some work after
        })
        .catch(function(err){
            // do some error handling
        });
```

### Creating a Func sequence

```javascript

    new FluidFunc('_1stFunc', function(param){
        // do the first func
    });

    new FluidFunc('_2ndFunc',function(param){
        //do the 2nd func
    });

    FluidFunc.start(['_1stFunc','_2ndFunc'], {paramName:'paramValue'})
        .then(function(result){
            // do something after
        })
        .catch(function(err){
            // do some error handling
        });
```

```javascript

    FluidFunc.create('_1stFunc')
        .onStart(function(param){
            // do the first func
        })
        .connect('_2ndFunc')
        .onStart(function(param){
            // do the 2nd func
        })
        .execute({paramName:'paramValue'})
        .then(function(result){
            // do something after
        })
        .catch(function(err){
            // do some error handling
        });
```

### Accessing a parameter

Parameters are immutable and can be accessed by calling the field as function.

```javascript
    new FluidFunc('_1stFunc', function(param){
        // do the first func
        const paramValue = param.paramName();
    });

    FluidFunc.start('_1stFunc'], {paramName:'paramValue'})
        .then(function(result){
            // do something after
        })
        .catch(function(err){
            // do some error handling
        });

```

### Maintaining a context

The first parameter is accessible across the Func sequence.

```javascript
    new FluidFunc('_1stFunc', function(param){
        // do the first func
        const paramValue = param.paramName();
    });

    new FluidFunc('_2ndFunc',function(param){
        //do the 2nd func
         const paramValue = param.paramName();
    });

    FluidFunc.start(['_1stFunc','_2ndFunc'], {paramName:'paramValue'})
        .then(function(result){
            // do something after
        })
        .catch(function(err){
            // do some error handling
        });
```

In Func sequence you can set the next parameter by returning a value or an object in the action method.

```javascript
    new FluidFunc('_1stFunc', function(param){
        // do the first func
        const paramValue = param.paramName();
        return {
            from1st:'_1st says hi',
            person: {
                name: 'John Doe',
                age: 22
            }
        };
    });

    new FluidFunc('_2ndFunc',function(param){
        //do the 2nd func
         const paramValue = param.paramName();
         const _1stSaysHi = param.from1st(); // got from the previous func
         const name = param.person('name');
    });

    FluidFunc.start(['_1stFunc','_2ndFunc'], {paramName:'paramValue'})
        .then(function(result){
            // do something after
        })
        .catch(function(err){
            // do some error handling
        });
```

Returning a literal value will be accessible by paramater.value on the next Func.

```javascript
    new FluidFunc('_1stFunc', function(param){
        // do the first func
        const paramValue = param.paramName();
        return '_1st says hi';
    });

    new FluidFunc('_2ndFunc',function(param){
        //do the 2nd func
         const paramValue = param.paramName();
         const _1stSaysHi = param.value(); // got from the previous func
    });

    FluidFunc.start(['_1stFunc','_2ndFunc'], {paramName:'paramValue'})
        .then(function(result){
            // do something after
        })
        .catch(function(err){
            // do some error handling
        });
```

Returning a promise in Func

```javascript
    new FluidFunc('_1stFunc', function(param){
        // do the first func
        const paramValue = param.paramName();
        return new Promise(function(resolve,reject){
            resolve('_1st says hi');
        });
    });

    new FluidFunc('_2ndFunc',function(param){
        //do the 2nd func
         const paramValue = param.paramName();
         const _1stSaysHi = param.value(); // got from the previous func
    });

    FluidFunc.start(['_1stFunc','_2ndFunc'], {paramName:'paramValue'})
        .then(function(result){
            // do something after
        })
        .catch(function(err){
            // do some error handling
        });
```


### Restricting parameters with func.strict

If you want to be strict with parameters and get only what you need you can enable strict mode per func.

```javascript

    new FluidFunc('_2ndFunc', function(parameters){
        const paramValue = parameters.paramName();
        const iNeedThisAlso = parameters.moreParam();
        // parameters.fillerParam will be undefined
    })
    .strict()
    .spec('paramName')
    .spec('moreParam');

    FluidFunc.start('_1stFunc',
     {paramName:'paramValue',
     fillerParam:'not needed value',
     moreParam:'I need this also'})
        .then(function(result){
            // do something after
        })
        .catch(function(err){
            // do some error handling
        });
```

### func.onBefore

If you want to have something to do before runing the Func use the func.onBefore.

```javascript

    new FluidFunc('_1stFunc', function(parameter) {

    })
    .onBefore(function(paramater){
        /* do some security check here or something you do before running the func */

        return true; // Func will continue to start
    });
```

Using promises.

```javascript

    new FluidFunc('_1stFunc', function(parameter) {
        // do some func thingy here
    })
    .onBefore(function(paramater){
        /* do some security check here or something you do before running the func */

        return new Promise(funciton(resolve, reject){
            resolve(true);// Func will continue to start
        });
    });
```

Note: FluidFunc will just skip and continue to the next Func when you return false value.

### func.onFail

A way to handle error or breakage in Func process. In this you have options to retry the Func or break the sequence.

```javascript

    new FluidFunc('_1stFunc', function(parameter) {
        // do some func thingy here
    })
    .onFail(function(error, retry, reject){
        retry();// will re process the Func
    });
```

onFail: Function(error: Error, retry: Function, reject: Function)

Param  | Description
-------| ----------------------------------------------------------
error  | Error instance that contains stack trace and error message
retry  | Function that triggers the reprocess of Func
reject | Breaks the Func sequence

### Specifications and validations with func.spec

#### spec.require

- To require value from parameters add require:true in spec

```javascript

    new FluidFunc('_1stFunc', function(parameter){
        const mandatoryField = parameter.mandatoryField(); //this field will always have value
    })
    .spec('mandatoryField', {
        require:true
    });

    FluidFunc.start('_1stFunc', {
        mandatoryField: 'hello'
    });

```

- Adding custom message

```javascript

    new FluidFunc('_1stFunc', function(parameter){
        const mandatoryField = parameter.mandatoryField(); //this field will always have value
    })
    .spec('mandatoryField', {
        require:true,
        requireMessage:'mandatory field is needed.'
    });

    FluidFunc.start('_1stFunc', {
        mandatoryField: 'hello'
    });

```

- Transforming the parameter value

transform: Function(current: String): Promise

Param       | Description
------------| --------------------------------------
currentValue| Has the current value of the parameter

Note: Transform function should always return Promise

```javascript

    new FluidFunc('_1stFunc', function(parameter){
        const userData = parameter.user(); // this is now a user object
    })
    .spec('user', {
        require:true,
        requireMessage:'UserId field is needed.'
    }, transform: function(currentValue){
        return new Promise((resolve,reject)=>{
            FindUserById(currentValue)
                .then(function(user){
                    resolve(user);
                })
                .catch(function(err){
                    reject(err);
                });
        });
    });

    FluidFunc.start('_1stFunc', {
        user: '#432userID'
    });

```

- Translating the parameters

Tranlates the parameter value into a new sets of parameters

transform: Function(current: String): Promise

Param       | Description
------------| --------------------------------------
value       | Has the current value of the parameter
context     | Func current context

Note: Tranlate function should always return Promise

```javascript

    new FluidFunc('_1stFunc', function(parameter){
        const username = parameter.username();
        const fullname = parameter.fullname();
    })
    .spec('user', {
        require:true,
        requireMessage:'User field is needed.'
    }, translate: function(currentValue, context){
        return new Promise((resolve, reject)=>{
            context.set('username', currentValue.username);
            context.set('fullname', currentValue.fullname);
            resolve();
        });
    });

    FluidFunc.start('_1stFunc', {
        user: {
            username: 'rickzx98',
            fullname: 'Jerico de Guzman'
        }
    });

```

- Customer validator

validate: Function(current: String): Promise

Param       | Description
------------| --------------------------------------
currentValue| Has the current value of the parameter

```javascript    
    new FluidFunc('_1stFunc', function(parameter){
        const userData = parameter.user(); // this is now a user object
    })
    .spec('user', 
     validate: function(currentValue){
        return new Promise((resolve,reject)=>{
            if(currentValue === validEmail){
                resolve();
            } else{
                reject();
            }
        });
    });

    FluidFunc.start('_1stFunc', {
        email: 'john.doe@email.com'
    });
```

### Reducer

To make the Func act as reducer use func.reduce(${fieldToReduce})

```javascript

        new FluidFunc('_1stFunc', (parameter, current, index) => {
            return current + (parameter.value ? parameter.value() : 0);
        }).reduce('sampleArray');

        FluidFunc.start('_1stFunc', { sampleArray: [1, 2, 3, 4, 5] })
            .then(result => {
                //expect(result.value()).to.be.equal(15);
            });
```

### Cache

func.cache(cachedFor:number)

Param     | Description                                                          | Default
----------|----------------------------------------------------------------------|---------
cachedFor | Sets the number (in milliseconds) for how long it will cache the Func| 1500

```javascript
  
   var counter = 0;

   new FluidFunc('_1stFunc', (parameter) => {
        counter++;
            return '_1st';
        })
        .strict()
        .cache();

   new FluidFunc('_2ndFunc', (parameter) => {
        counter++;
            return '_2nd';
        })
        .strict()
        .cache();

FluidFunc.start(['_1stFunc','_2ndFunc','_1stFunc','_2ndFunc'], {
    hi:'hello'})
    .then(()=>{
        //counter will be equal to two
    });

```

Note: The cache is based on the parameter set to the Func action so enabling .strict() mode will make cache more effective.


### Monitoring

To monitor a single Func action you must do the following:
```javascript
    FluidFunc.config({
        logMonitor: function(monitor) {
              //console.log(monitor);
        }
    });
```

- Monitor contains the detail of every Func process including it parameters and resolved context.

### Plugins

Field        | Type     | Description                                               | Required
-------------|----------|-----------------------------------------------------------|---------------------
name         | String   | Name of the plugin                                        | true
action       | Function | Action that will run                                      | true
before/after | array    | list of Func names the action will invoke to before/after | atleast one of either


- Plugin.action: Function(context: Context) - Will handle the plugin execution. All return types will be merged to the Context parameter.
- Plugin.before - Will run the plugin before executing the Func
- Plugin.after - Will run the plugin after the Func completes

```javascript
    FluidFunc.config({
        plugins: [
            {name:'AwesomePlugin', 
            action: function(context) {
                return "hello";
            },
            before:['Func1'],
            after:['Func2']
            }
        ]
    });

    FluidFunc.create('Func1').onStart(context=> {
        // plugin was triggered before Func1
        context.AwesomePlugin() // hello
    });

    FluidFunc.create('Func2').onStart(context=> {
    })
    .execute(context=> { 
        // plugin was triggered after Func2
        context.AwesomePlugin() // hello
    });

```

### Authors

* **Jerico de Guzman** - [LinkedIn](https://www.linkedin.com/in/jerico-de-guzman-35126657)

See also the list of [contributors](https://github.com/rickzx98/fluid-chains/contributors) who participated in this project.

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
