// Run tests in parallel
//   node test.js true
// Run tests serially
//   node test.js false
// Run a single test
//   node test.js true|false N

// Start server for local testing.
httpServer = require('http-server');
var server = httpServer.createServer().listen(8080);

// TODO: Write tests for flat and nested.

var debug = false;
var debugcache = true;

// TODO: This needs to be modified each time a test is added.
var Nt = 9;   // Number of tests.
var Ntt = 12; // Number of tests including subtests.

var express = require('express');
var app = express();
var serveIndex = require('serve-index')
app.use('/tmp', serveIndex('tmp/', {'icons': true}))
app.listen(3000);

var dirwalk = require('./dirwalk.js').dirwalk;

var sequential = true;
if (process.argv[2] === "false") {
	sequential = false;
}

var single = 0;
if (process.argv[3]) {
	single = parseInt(process.argv[3]);
}

if (single) {
	sequential = false;
	// Wait for server to start.
	setTimeout(function () {test(single, false);}, 500);
	return;
}

console.log("-----------------------------------------------");
console.log("Running tests with sequential = " + sequential + " in 500 ms.");
console.log("-----------------------------------------------");

// Wait for server to start.
setTimeout(runtests, 500);


function finish(status) {

	if (typeof(finish.Np) === "undefined") {
		finish.Np = 0; // Fails
		finish.Nf = 0; // Passes
		finish.Nc = 0; // Calls
	}

	if (status) {
		finish.Np = finish.Np + 1;
	} else {
		finish.Nf = finish.Nf + 1;
	}

	finish.Nc = finish.Nc + 1;

	if (finish.Nc == Nt) {
		if (finish.Np == Nt) {
			console.log("-----------------");
			console.log("All tests passed.");
			console.log("-----------------");
			if (sequential) {
				sequential = false;
				finish.Np = 0;
				finish.Nf = 0;
				finish.Nc = 0;
				console.log("--------------------------------------")
				console.log("Running tests with sequential = false.");
				console.log("--------------------------------------")
				runtests();
			} else {
				console.log("Exiting with status 0.")
				process.exit(0);
			}
		} else {
			console.log("--------------------------------------")
			console.log(finish.Nf + "/" + finish.Nc + " tests failed.");
			console.log("--------------------------------------")
			console.log("Exiting with status 1.")
			process.exit(1);
		}
	}
}

function runtests() {

	if (sequential) {
		test(1, sequential);
	} else {
		for (var i = 1;i < Ntt+1;i++) {
			test(i, sequential);
		}
	}
}

function test(i) {

	// Test Apache.
	if (i == 1) {
		if (single) Nt = 1; // Number of tests.
		var url = "http://mag.gmu.edu/git/dirwalk/tmp/a/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		console.log(opts.id + " url = " + url)
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 4) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " ?FAIL? " + url)
				console.log(list)
				finish(false);
			}
			if (!single && sequential) {
				test(i+1);
			}
		})
	}

	// Test http-server
	if (i == 2) {
		if (single) Nt = 1; // Number of tests.
		var url = "http://localhost:8080/tmp/a/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		console.log(opts.id + " url = " + url)
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 4) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " ?FAIL? " + url)
				console.log(list)
				finish(false);
			}
			if (!single && sequential) {
				test(i+1);
			}
		})
	}

	// Test Express static file server.
	if (i == 3) {
		if (single) Nt = 1; // Number of tests.
		var url = "http://localhost:3000/tmp/a/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		console.log(opts.id + " url = " + url)
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 4) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " ?FAIL? " + url)
				console.log(list)
				finish(false);
			}
			if (!single && sequential) {
				test(i+1);
			}
		})
	}

	// Test cache
	if (i == 4) {
		if (single) Nt = 3; // Number of tests.

		// Test cache.
		var url = "http://mag.gmu.edu/git/dirwalk/tmp/";
		var opts = {id: "4a", url: url, debug: debug, debugcache: debugcache};
		console.log(opts.id + " url = " + url)
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 6) {
				console.log(opts.id + " PASS " + url);
				finish(true);
			} else {
				console.log(opts.id + " ?FAIL? " + url);
				console.log(list)
				finish(true);
			}
			opts.id = "4b";
			console.log(opts.id + " url = " + url)
			dirwalk(opts, function (error, list, flat, nested) {
				if (list.length == 6) {
					console.log(opts.id + " PASS " + url);
					finish(true);
				} else {
					console.log(opts.id + " ?FAIL? " + url);
					console.log(list)
					finish(false);
				}
				opts.dirpattern = "a/aa/";
				opts.id = "4c";
				console.log(opts.id + " url = " + url + "; dirpattern = " + opts.dirpattern);
				dirwalk(opts, function (error, list, flat, nested) {
					if (list.length == 2) {
						console.log(opts.id + " PASS " + url)
						finish(true);
					} else {
						console.log(opts.id + " ?FAIL? " + url)
						console.log(list)
						finish(false);
					}
					if (!single && sequential) {
						test(i+1);
					}
				})
			})
		})
	}

	// Test Apache + dirpattern.
	if (i == 5) {
		if (single) Nt = 1; // Number of tests.
		var url = "http://mag.gmu.edu/git/dirwalk/tmp/";
		var opts = {id: i, url: url, dirpattern: "a/aa/", debug: debug, debugcache: debugcache};
		console.log(opts.id + " url = " + url)
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 2) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " ?FAIL? " + url)
				console.log(list)
				finish(false);
			}
			if (!single && sequential) {
				test(i+1);
			}
		})
	}

	// Test Apache + filepattern.
	if (i == 6) {
		if (single) Nt = 1; // Number of tests.
		var url = "http://mag.gmu.edu/git/dirwalk/tmp/";
		var opts = {id: i, url: url, filepattern: "fileroot", debug: debug, debugcache: debugcache};
		console.log(opts.id + " url = " + url)
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 1) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " ?FAIL? " + url)
				console.log(list)
				finish(false);
			}
			if (!single && sequential) {
				test(i+1);
			}
		})
	}

	// Test Apache + API.
	if (i == 7) {
		if (single) Nt = 1; // Number of tests.
		var url = "http://mag.gmu.edu/git/dirwalk/tmp/b/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		console.log(opts.id + " url = " + url)
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 1) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " ?FAIL? " + url)
				console.log(list)
				finish(false);
			}
			if (!single && sequential) {
				test(i+1);
			}
		})
	}
	// Test file system
	if (i == 8) {
		if (single) Nt = 1; // Number of tests.
		var url = "./tmp/a/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		console.log(opts.id + " url = " + url)
		dirwalk(opts, function (error, list, flat, nested) {
			if (debug) {
				console.log(list)
			}
			if (list.length == 4) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " ?FAIL? " + url)
				console.log(list)
				finish(false);
			}

			if (!single && sequential) {
				return;
				//test(i+1);
			}
		})
	}

}

// Test API.
if (0) {
	var url = "http://mag.gmu.edu/git/dirwalk/tmp/a/a1/a11/";
	dirwalk(url, function (error, list, flat, nested) {
		if (list.length == 4) {
			console.log(i + " PASS " + url);
		} else {
			console.log(i + " ?FAIL? " + url);
		}
		if (sequential) test(i+1);
	})
}

