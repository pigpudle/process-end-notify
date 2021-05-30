const watch = require('./src/watch');

class API {

    static async watchUntilFinishes(callback) {
        await watch(callback);
    }

}

module.exports = API;