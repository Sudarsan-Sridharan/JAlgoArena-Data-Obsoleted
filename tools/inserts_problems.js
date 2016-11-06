var Datastore = require('nedb');

var problemsDb = new Datastore({filename: '../problems.db', autoload: true});
problemsDb.loadDatabase(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("DB loaded: problems.db");
    }
});

var fs = require('fs');

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
            });
        });
    });
}

readFiles('../assets/problems/', function(filename, content) {
    var problemAsJson = JSON.parse(content);
    problemsDb.update(
        {id: problemAsJson.id},
        problemAsJson,
        {upsert: true},
        function (err) {
            if (err) return next(err);

            problemsDb.findOne({id: problemAsJson.id}, function (err, problem) {
                if (err) console.log(err);
                else console.log("Inserted: " + problem.id);
            });
        }
    );
}, function(err) {
    throw err;
});