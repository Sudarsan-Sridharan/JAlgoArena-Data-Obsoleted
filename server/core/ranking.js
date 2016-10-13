var _ = require('lodash');

var calculateBonusPointsForFastestSolutions = function (submissions, users) {
    var bonusPointsForFastestSolution = {};
    var problems = _.uniq(_.map(submissions, function(submission) {
        return submission.problemId
    }));

    _.forEach(users, function (user) {
        bonusPointsForFastestSolution[user._id] = 0;
    });

    _.forEach(problems, function (problem) {
        var problemSubmissions = _.filter(submissions, function (submission) {
            return submission.problemId === problem;
        });

        var fastestSubmission = _.minBy(problemSubmissions, 'elapsed_time');

        if (fastestSubmission) {
            bonusPointsForFastestSolution[fastestSubmission.userId] = bonusPointsForFastestSolution[fastestSubmission.userId] + 1;
        }
    });

    return bonusPointsForFastestSolution;
};

function ranking(users, submissions) {
    var ranking = [];

    var bonusPointsForFastestSolution = calculateBonusPointsForFastestSolutions(
        submissions, users
    );

    _.forEach(users, function (user) {
        var userSubmissions = _.filter(submissions, function (submission) {
            return submission.userId === user._id;
        });

        var solvedProblems = _.map(userSubmissions, function(submission) {
            return submission.problemId;
        });

        ranking.push(
            rankEntry(user.username, score(userSubmissions) + bonusPointsForFastestSolution[user._id], solvedProblems)
        );
    });

    return _.orderBy(ranking, ['score'], ['desc']);
}

function score(userSubmissions) {
    var uniqueProblems = _.uniqBy(userSubmissions, 'problemId');

    function timeFactor(elapsedTime) {
        if (elapsedTime > 500) {
            return 1;
        }

        if (elapsedTime > 100) {
            return 3;
        }

        if (elapsedTime > 10) {
            return 5;
        }

        if (elapsedTime >= 1) {
            return 8;
        }

        return 10;
    }

    return _.sumBy(uniqueProblems, function(problem) {
        return problem.level * timeFactor(problem.elapsed_time);
    });
}

function problemRanking(users, submissions) {
    var ranking = [];

    var bonusPointsForFastestSolution = calculateBonusPointsForFastestSolutions(
        submissions, users
    );

    _.forEach(submissions, function (submission) {
        var user = users.filter(function (user) {
            return user._id === submission.userId
        });

        if (user) {
            var username = user[0].username;
            ranking.push({
                hacker: username,
                score: score([submission]) + bonusPointsForFastestSolution[user[0]._id],
                elapsed_time: submission.elapsed_time
            });
        }
    });

    return _.orderBy(ranking, ['elapsed_time']);
}

function rankEntry(userName, score, solvedProblems) {
    return {
        hacker: userName,
        score,
        solvedProblems
    }
}

module.exports = {ranking, score, problemRanking};