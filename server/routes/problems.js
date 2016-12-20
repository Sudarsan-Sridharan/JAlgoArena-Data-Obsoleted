var passport = require('passport');
var requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app, problemsDb) {

    app.get('/problems', function(req, res, next) {
        problemsDb.find(
            {},
            function (err, docs) {
                if (err) return next(err);
                return res.json(docs);
            }
        )
    });

    app.get('/problems/:problemId', function(req, res, next) {
        var problemId = req.params.problemId;

        problemsDb.findOne({id: problemId}, function (err, problem) {
            if (err) return next(err);
            return res.json(problem);
        })
    });

    app.post('/problems/new', requireAuth, function(req, res, next) {
        var newProblem = req.body;

        problemsDb.update(
            {id: newProblem.id},
            newProblem,
            {upsert: true},
            function (err) {
                if (err) return next(err);

                newProblem.findOne({id: newProblem.id}, function (err, problem) {
                    if (err) return next(err);
                    return res.json(problem);
                });
            }
        );
    });
};