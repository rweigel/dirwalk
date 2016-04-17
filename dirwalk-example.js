var dirwalk = require('./dirwalk.js').dirwalk;

// Start server for local testing.
httpServer = require('http-server');
var server = httpServer.createServer().listen(8080);

// Increment counter so that we can exit when all demos complete.
var N = 0;

N = N + 1;
dirwalk({url: "http://localhost:8080/tmp/"}, cb);

N = N + 1;
dirwalk({url: "./tmp/"}, cb);

N = N + 1;
dirwalk({url: "http://localhost:8080/tmp/a/"}, cb);

N = N + 1;
dirwalk({url: "./tmp/a/"}, cb);

function cb(error, list, flat, nested) {
	if (!cb.Nc) {cb.Nc = 0;}
	cb.Nc = cb.Nc + 1;
	console.log(list);
	console.log(flat);
	console.log("---");
	if (cb.Nc == N) {
		process.exit(0);
	}
}
