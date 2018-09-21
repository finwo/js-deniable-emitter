# Deniable Emitter

Deniable Event Emitter for asynchronous verification

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [new DeniableEmitter()](#constructor)
  - [emitter.has()](#emitter.has)
  - [emitter.on()](#emitter.on)
  - [emitter.once()](#emitter.once)
  - [emitter.emit()](#emitter.emit)
  - [emitter.off()](#emitter.off)
- [Contributing guidelines](#contributing)

## Installation

```bash
npm install --save deniable-emitter
```

## Usage

```javascript
// Importing the module
import { DeniableEmitter } from 'deniable-emitter';

// Initialize a new emitter
const emitter = new DeniableEmitter();

// TODO: better example
```

## API
### constructor

```javascript

// Importing the module
import { DeniableEmitter } from 'deniable-emitter';

// Initialize a new emitter
const emitter = new DeniableEmitter();

// TODO: explain inheritance isn't thought of
```

### emitter.has

```javascript
// TODO
```

### emitter.on

```javascript
function handler( name, ...args ) {
  const callback = args.pop(); // (err,value)=>{}
  
  // Finish by returning a value
  return 'Resolving value';
  
  // Finish by calling the callback
  callback();
  
  // Finish with an error
  callback('Some error');
  
  // Or return a promise
  return new Promise(function( resolve, reject ) {
    // ... your code ...
  });
}

// Make the handler listen for any events
emitter.on('*', handler);
// < emitter

// Make the handler listen for foo events
emitter.on('foo', handler);
// < emitter

// TODO: better explanation
```

### emitter.once

```javascript
// TODO
```

### emitter.emit

```javascript

// Always returns undefined & tries callback
emitter.emit('foo', function( err, response ) {
  console.log(response); // "Resolving value";
});
// < undefined

// TODO: better explanation
```

### emitter.off

```javascript

// Removes handler from the foo event
emitter.off('foo', handler);
// < emitter

// TODO: better explanation
```

## Contributing

### Bugs

Take a peek at the [issues page](https://github.com/finwo/js-deniable-emitter/issues) to ensure your issue isn't already
known and/or being worked on. If it's not, please create a new issue with a detailed description of what happend & how
to reproduce the unexpected behavior.

If you decide to take on the challenge of fixing a known (or unknown) issue, you can do so by sending in a pull request
from your own fork of the project. Once it has been tested and approved, it will be merged into the master branch of the
repository.

### Feature requests

If you can't find a feature you like in the repository, please go to the
[issues page](https://github.com/finwo/js-deniable-emitter/issues) to search for the feature you would like to see. If
you still can't find it, you can request a new feature by creating a new issue with the `feature-request`, providing a
detailed description of the feature, how it would work & preferably what issue it would solve.

New code for feature requests follows the same path as code for bug fixes.
