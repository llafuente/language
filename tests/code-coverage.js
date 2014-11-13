"use strict";

var ass = require('ass').enable(),
    cp = require('child_process'),
    path = require('path'),
    tests = require("fs").readdirSync(__dirname).filter(function (file) {
        console.log(file);
        return file.indexOf("test-") !== -1;
    }),
    current_test = 0;

    console.log(tests);

// .. run all of your tests, spawning instrumented processes

function next_test() {
    var kid;
    if (current_test < tests.length) {
        kid = cp.fork(path.join(__dirname, tests[current_test++]), [], { stdio: 'inherit' });

        kid.on("exit", next_test);
    } else {
        ass.report('html', function(err, report) {
            console.log(report);
            require('fs').writeFileSync(path.join(__dirname, "..", "coverage.html"), report);

            ass.report('json', function(err, r) {
                console.log(r);
            });
        });

    }
}

next_test();