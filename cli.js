const Watcher = require('./src/Watcher');

(async function() {
    await new Watcher().start();
})();