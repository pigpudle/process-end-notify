const readline = require('readline');
const terminal = require('terminal-kit').terminal;

class IO {

    static send(message) {
        console.log(message);
    }

    static get(message) {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(message, (result) => {
                resolve(result);
                setTimeout(() => rl.close());
            });
        });
    }
    
    static menu(message, items) {
        return new Promise((resolve, reject) => {
            console.log(message);
            terminal.singleColumnMenu(items, (err, response) => {
                if (err) return reject(err);
                resolve(response.selectedIndex);
            });
        });
    }

}

module.exports = IO;