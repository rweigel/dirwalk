var dirwalk = require('./dirwalk.js').dirwalk;
var _ = require('lodash');

var lists = [];

if (0) {
	dirwalk({url: "./tmp/", usecache: false, debugcache: true}, function (err,list) {
		console.log(list)
	})
}

if (0) {
	dirwalk({url: "./tmp/", debugcache: true}, function (err,list) {
		lists[0] = list;
		dirwalk({url: "./tmp/", debugcache: true}, cb0);
	});
	function cb0(error, list) {
		console.log("lists match: " + _.isEqual(lists[0], list));
	}
}

if (1) {
	dirwalk({url: "./tmp/", usecache: false, debugcache: true}, function (err,list) {
		lists[1] = list;
		dirwalk({url: "./tmp/", usecache: false, debugcache: true}, cb1);
	});
	function cb1(error, list) {
		console.log("lists match: " + _.isEqual(lists[1], list));
	}
}

