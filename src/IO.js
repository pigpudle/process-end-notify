const readline = require('readline');
const terminal = require('terminal-kit').terminal;
const EventEmitter = require('events');

const io = new EventEmitter();

io.on('info', (message) => {
    console.log(message);
});

io.on('get', (message, callback, metadata) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(message, (result) => {
        callback(null, result, metadata);
        setTimeout(() => rl.close());
    });
});

io.on('menu', (message, items, callback, metadata) => {
    console.log(message);
    terminal.singleColumnMenu(items, (err, response) => {
        callback(err, response.selectedIndex, metadata);
    });
});

io.on('error', (err) => {
    console.error(err);
});

module.exports = io;