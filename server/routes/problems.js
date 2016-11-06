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
};