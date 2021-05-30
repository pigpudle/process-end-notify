const ps = require('ps-node');

class Processes {

    constructor() {
        this.watchers = {};
    }

    static async searchByName(name) {
        return new Promise((resolve, reject) => {
            ps.lookup({ command: name.trim(), }, (err, processes) => {
                if (err) {
                    return reject(err);
                }
             
                resolve(processes);
            });
        });
    }

    static async searchByPid(pid) {
        return new Promise((resolve, reject) => {
            ps.lookup({ pid }, (err, processes) => {
                if (err) {
                    return reject(err);
                }

                const process = processes.find(process => process.pid === pid);
                resolve(process);
            });
        });
    }

    watchProcess({ pid, interval }, callback) {
        const intervalId = setInterval(async () => {
            const process = await Processes.searchByPid(pid);
            callback(!!process);
        }, interval);
        this.watchers[pid] = intervalId;
    }

    stopWatching(pid) {
        clearInterval(this.watchers[pid]);
        delete this.watchers[pid];
    }

    clearAllWatchers() {
        for (let pid in this.watchers) {
            clearInterval(this.watchers[pid]);
            delete this.watchers[pid];
        }
    }

}

module.exports = Processes;