# process-end-notify

This tool is designed to notify you when a specific process is finished. The library has a command-line interface. It can be used just as a single CLI tool. Or use can choose an API approach and pass your callback which will be executed when a process finishes.

## Usage
### CLI
1. Copy this repository.
2. Open a terminal window inside a folder with the downloaded lib.
3. Run `npm i`.
4. From your terminal run `npm run cli`.

#### CLI demo
![CLI demo](https://raw.githubusercontent.com/NeliHarbuzava/process-end-notify/master/demo/cli-demo.gif?token=AHNLBWES5RVJPDZHBCQD5GTAWOYCQ)

### API
1. Install the lib by running `npm install process-end-notify`.
2. Import the lib:
```js
const { Watcher } = require('process-end-notify');
```
3. Call watcher
```js
(async function() {
    await new Watcher().start();
})();
```
4. Full example:
```js
const { Watcher } = require('process-end-notify');

(async function() {
    await new Watcher().start();
})();
```
5. Advanced usage:
```js
const { Watcher } = require('process-end-notify');

(async function() {
    await new Watcher(
        ioInterface,
        finishCallback,
        exitCallback
    ).start();
})();
```
*Finish callback* is executed when a selected process finishes.
*Exit callback* is executed when a user chooses to exit or because of an error.

### API Advanced
To spy on full process of IO-events (custom IO for asking user input, processes selection) you should create an **IO interface** (by default `console` is used).

The IO interface should be and instance of the *EventEmitter*. An IO-interface should have `emit(...args)` method. The Watcher will emit events to it:
- `info` event for displaying some information (args: `(message)`);
- `get` event for retrieving info from a user (args: `(message, callback, metadata)`);
- `menu` event for a user to select from one of the options (args: `(message, items, callback, metadata)`);
- `error` event with errors thrown (args: `(error)`).

An example of IO-interface implementation that can be passed to Watcher are shown below:
```js
const EventEmitter = require('events');

class IOInterface extends EventEmitter {

    constructor() {
        super();
    }

    emit(event, ...args) {
        switch(event) {
            case 'info': {
                const message = args[0];
                // log message to your IO of preference
                break;
            }
            case 'get': {
                const message = args[0];
                const callback = args[1];
                const metadata = args[2];

                // get user input
                // and pass it back to callback:
                // callback(null, input, metadata);

                // if error occurs:
                // callback(err, input, metadata);
                break;
            }
            case 'menu': {
                const message = args[0];
                const items = args[1]; // an array of strings
                const callback = args[2];
                const metadata = args[3];

                // show a menu to a user
                // pass selected index back using:
                // callback(null, index, metadata);                
                break;
            }
            case 'error':
                const error = args[0];
                // show an error
                break;
            default:
                super.on(...args);
        }
    }

}
```
