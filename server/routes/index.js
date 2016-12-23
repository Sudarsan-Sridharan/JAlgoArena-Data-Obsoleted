var router = require('express').Router();

module.exports = function (app, passport, submissionsDb, userDb, problemsDb, ranking, problemRanking) {
    require('./authentication.js')(app, passport);
    require('./submission.js')(app, submissionsDb, userDb);
    require('./ranking.js')(app, submissionsDb, userDb, ranking, problemRanking);
    app.use('/', router);
};
