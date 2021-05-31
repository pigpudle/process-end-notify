const IO = require('./IO');
const Processes = require('./Processes');

const watcher = new Processes();

async function watch(callback = () => {}) {
    try {
        IO.send('Search by name through processes list.');
        const name = await IO.get('Enter process name or part of it: ');
    
        IO.send('Looking for processes...');
        const foundProcesses = await Processes.searchByName(name);

        if (foundProcesses.length === 0) {
            IO.send('No processes found');
            process.close();
        }

        const menuItems = [
            '0. Exit program',
            ...foundProcesses.map((process, index) => `${index + 1}. ${process.command}: ${process.arguments}`)
        ];

        const selectedProcessIndex = await IO.menu('Select a process:', menuItems);
        const exitOptionIndex = 0;
        if (selectedProcessIndex === exitOptionIndex) {
            process.exit();
        }

        const pid = foundProcesses[selectedProcessIndex - 1].pid;
        IO.send(`Selected the process with pid ${pid}`);

        let interval;
        do {
            interval = await IO.get('Enter watch interval (in seconds): ');
            interval = parseInt(interval);
        } while(!interval);

        IO.send(`Started watching the process...`);
    
        watcher.watchProcess({ pid, interval: interval * 1000 }, (isRunning) => {
            if (!isRunning) {
                IO.send(`Process with pid ${pid} finished.`);
                watcher.stopWatching(pid);
                callback();
                process.exit();
            }
        });
    } catch(err) {
        console.error(err);
        watcher.clearAllWatchers();
        callback(err);
        process.exit();
    }
}

module.exports = watch;