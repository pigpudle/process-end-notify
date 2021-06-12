const Processes = require('./Processes');
const EventEmitter = require('events');

const processWatcher = new Processes();

const WATCHER_INTERVALS = [
    1,
    2,
    4,
    5,
    10,
    30,
    60,
    120
];

class Watcher extends EventEmitter {
    constructor(io, finishCallback, exitCallback) {
        super();

        this.io = io || require('./io');
        this.finishCallback = finishCallback || (() => {
            process.exit();
        });
        this.exitCallback = exitCallback || (() => {
            process.exit();
        });
    }

    async start() {
        this.io.emit('info', 'Search by name through processes list.');
        this.io.emit('get', 'Enter process name or part of it: ', this.onProcessNameReceived.bind(this));
    }

    onError(err) {
        this.io.emit('error', err);
        processWatcher.clearAllWatchers();
        this.exit();
    }

    exit() {
        if (this.exitCallback) {
            return this.exitCallback();
        }
        process.exit();
    }

    async onProcessNameReceived(err, processName) {    
        if (err) return this.onError(err);

        this.io.emit('info', 'Looking for processes...');
        const foundProcesses = await Processes.searchByName(processName);
    
        if (foundProcesses.length === 0) {
            this.io.emit('info', 'No processes found');
            return this.exit();
        }
    
        const menuItems = [
            '0. Exit program',
            ...foundProcesses.map((process, index) => `${index + 1}. ${process.command}: ${process.arguments}`)
        ];

        this.io.emit('menu', 'Select a process:', menuItems, this.onProcessSelected.bind(this), { foundProcesses });
    }

    onProcessSelected(err, selectedProcessIndex, { foundProcesses }) {
        if (err) return this.onError(err);

        const exitOptionIndex = 0;
        if (selectedProcessIndex == exitOptionIndex) {
            this.io.emit('info', 'Exit program');
            return this.exit();
        }

        const pid = foundProcesses[selectedProcessIndex - 1].pid;
        this.io.emit('info', `Selected the process with pid ${pid}`);

        this.io.emit('menu', 'Enter watch interval (in seconds): ', WATCHER_INTERVALS, this.onWatchIntervalReceived.bind(this), { pid });
    }

    onWatchIntervalReceived(err, selectedIntervalIndex, metadata) {
        if (err) return this.onError(err);
        
        this.io.emit('info', `Started watching the process...`);

        const { pid } = metadata;

        processWatcher.watchProcess({ pid, interval: WATCHER_INTERVALS[selectedIntervalIndex] * 1000 }, (isRunning) => {
            if (!isRunning) {
                this.io.emit('info', `Process with pid ${pid} finished.`);
                processWatcher.stopWatching(pid);
                this.finishCallback();
            }
        });
    }
}

module.exports = Watcher;