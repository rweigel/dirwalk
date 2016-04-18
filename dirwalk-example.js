var dirwalk = require('./dirwalk.js').dirwalk;
var _ = require('lodash');

// Start server for local testing.
httpServer = require('http-server');
var server = httpServer.createServer().listen(8080);

// Increment counter so that we can exit when all demos complete.
var N = -1;

N = N + 1;
dirwalk({url: "http://localhost:8080/tmp/", debug: false}, cb);

N = N + 1;
dirwalk({url: "./tmp/", debug: false}, cb);

N = N + 1;
dirwalk({url: "http://mag.gmu.edu/git/dirwalk/tmp/", debug: false}, cb);

function cb(error, list, flat, nested) {
	if (typeof(cb.Nc) === "undefined") {
		cb.Nc = 0;
		cb.lists = [];
	}
	cb.lists[cb.Nc] = list

	cb.Nc = cb.Nc + 1;
	if (cb.Nc == N+1) {
		console.log("Lists 0 and 1 match: " + _.isEqual(cb.lists[0], cb.lists[1]));
		console.log("Lists 0 and 2 match: " + _.isEqual(cb.lists[0], cb.lists[2]));
		console.log(JSON.stringify(cb.lists[0]))
		process.exit(0);
	}
}
