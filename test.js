var express = require('express');
var app = express();
var serveIndex = require('serve-index')
app.use('/tmp', serveIndex('tmp/', {'icons': true}))
app.listen(3000);

var dirwalk = require('../tsds2/tsdsfe/js/dirwalk.js').dirwalk;

var debug = false;
var debugcache = false;


var sequential = true;
console.log("-----------------------------------------------");
console.log("Running tests with sequential = true in 500 ms.");
console.log("-----------------------------------------------");

// Wait for server to start.
setTimeout(runtests, 500);

var Nt = 14; // Number of tests.

function finish(status) {
	if (typeof(finish.Np) === "undefined") {
		finish.Np = 0;
		finish.Nf = 0;
		finish.Nc = 0;
	}
	finish.Nc = finish.Nc + 1;
	//console.log(Nc)
	if (status) {
		finish.Np = finish.Np + 1;
	} else {
		finish.Nf = finish.Nf + 1;
	}
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
		for (var i = 1;i < 12;i++) {
			test(i, sequential);
		}
	}
}

function test(i) {

	//console.log("Running test " + i);

	if (i == 1) {
		// Test cache.
		var url = "http://mag.gmu.edu/tmp/";
		var opts = {id: "1a", url: url, debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 38) {
				console.log(opts.id + " PASS " + url);
				finish(true);
			} else {
				console.log(opts.id + " FAIL " + url);
				finish(true);
			}
			opts.id = "1b";
			dirwalk(opts, function (error, list, flat, nested) {
				if (list.length == 38) {
					console.log(opts.id + " PASS " + url);
					finish(true);
				} else {
					console.log(opts.id + " FAIL " + url);
					finish(false);
				}
				opts.dirpattern = "/a/a1/";
				opts.id = "1c";
				dirwalk(opts, function (error, list, flat, nested) {
					if (list.length == 12) {
						console.log(opts.id + " PASS " + url)
						finish(true);
					} else {
						console.log(opts.id + " FAIL " + url)
						finish(false);
					}
					if (sequential) test(i+1);
				})
			})
		})
	}

	if (i == 2) {
		var url = "http://localhost:3000/tmp/a/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 2) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}

	if (i == 3) {
		// First start http-server from directory containing subdirectory test/.
		var url = "http://localhost:8080/tmp/a/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 2) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}

	if (i == 4) {
		// First start http-server from directory containing subdirectory test/.
		var url = "http://localhost:8080/tmp/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 2) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}


	// Test Apache.
	if (i == 5) {
		var url = "http://mag.gmu.edu/tmp/a/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 22) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}

	// Test Apache.
	if (i == 6) {
		var url = "http://mag.gmu.edu/tmp/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 38) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}

	// Test Apache.
	if (i == 7) {
		var url = "http://mag.gmu.edu/tmp/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 38) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}


	// Test API.
	if (i == 8) {
		var url = "http://mag.gmu.edu/tmp/a/a1/a11/";
		var opts = {id: i, url: url, debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (list.length == 4) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}

	if (i == 9) {
		// Test dirpattern.
		var url = "http://mag.gmu.edu/tmp/";
		var opts = {id: i, url: url, dirpattern: "/a/a1/", debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (error) console.log(error);
			if (list.length == 12) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}

	if (i == 10) {
		// Test filepattern.
		var url = "http://mag.gmu.edu/tmp/";
		var opts = {id: i, url: url, filepattern: "C=D", debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (error) console.log(error);
			if (list.length == 9) {
				console.log(i + " PASS " + url)
				finish(true);
			} else {
				console.log(i + " FAIL " + url)
				finish(false);
			}
			if (sequential) test(i+1);
		})
	}

	if (i == 11) {
		// Test indirect cache hit.
		var url = "http://mag.gmu.edu/tmp/";
		var opts = {id: "" + i + "a", url: url, dirpattern: "/a/a1/", debug: debug, debugcache: debugcache};
		dirwalk(opts, function (error, list, flat, nested) {
			if (error) console.log(error);
			if (list.length == 12) {
				console.log(i + "a PASS " + url)
				finish(true);
			} else {
				console.log(i + "a FAIL " + url)
				console.log(list)
				finish(false);
			}
			bopts = {id: "" + i + "b", url: url, filepattern: "C=D", debug: debug, debugcache: debugcache};
			dirwalk(bopts, function (error, list, flat, nested) {
				if (error) console.log(error);
				if (list.length == 9) {
					console.log(i + "b PASS " + bopts.url)
					finish(true);
				} else {
					console.log(i + "b FAIL " + bopts.url)
					finish(false);
				}
			})
		})
	}
}

// Test API.
if (0) {
	var url = "http://mag.gmu.edu/tmp/a/a1/a11/";
	dirwalk(url, function (error, list, flat, nested) {
		if (list.length == 4) {
			console.log(i + " PASS " + url);
		} else {
			console.log(i + " FAIL " + url);
		}
		if (sequential) test(i+1);
	})
}

