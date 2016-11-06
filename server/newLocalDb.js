var Datastore = require('nedb');

module.exports = function (filename, logger) {
    var db = new Datastore({filename: filename, autoload: true});
    db.loadDatabase(function (err) {
        if (err) {
            logger.error(err);
        } else {
            logger.debug("DB loaded: " + filename);
        }
    });

    return db;
};