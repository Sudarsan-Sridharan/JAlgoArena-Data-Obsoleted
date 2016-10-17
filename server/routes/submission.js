var passport = require('passport');
var requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app, submissionDb, usersDb) {

    app.post('/submissions', requireAuth, function(req, res, next) {
        var newSubmission = req.body;

        submissionDb.update(
            {userId: newSubmission.userId, problemId: newSubmission.problemId},
            newSubmission,
            {upsert: true},
            function (err) {
                if (err) return next(err);

                submissionDb.find({userId: newSubmission.userId}, function (err, docs) {
                    if (err) return next(err);
                    return res.json(docs);
                });
            }
        );
    });

    app.get('/submissions/:userId', requireAuth, function(req, res, next) {
        var userId = req.params.userId;

        submissionDb.find({userId: userId}, function (err, docs) {
            if (err) return next(err);
            return res.json(docs);
        })
    });

    app.get('/submissions/', function(req, res, next) {

        passport.authenticate('jwt', { session: false }, function(err, user) {
            if (err) { return next(err); }
            if (!user || !user.isAdmin) { return res.json({}); }

            submissionDb.find({}, function (err, docs) {
                if (err) return next(err);
                return res.json(docs);
            });
        })(req, res, next);
    });

    app.post('/submissions/delete/:submissionId', function(req, res, next) {
        var submissionId = req.params.submissionId;

        passport.authenticate('jwt', { session: false }, function(err, user) {
            if (err) { return next(err); }
            if (!user || !user.isAdmin) { return res.json({}); }

            submissionDb.remove({_id: submissionId}, {}, function (err, numRemoved) {
                if (err) return next(err);
                console.log('Removed: ' + submissionId);
                return res.json({numRemoved});
            });
        })(req, res, next);
    });

    app.get('/users/', function(req, res, next) {

        passport.authenticate('jwt', { session: false }, function(err, user) {
            if (err) { return next(err); }
            if (!user || !user.isAdmin) { return res.json({}); }

            usersDb.find({},
                {password: 0},
                function (err, docs) {
                    if (err) return next(err);
                    return res.json(docs);
                });
        })(req, res, next);
    });
};