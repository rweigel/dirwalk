var dirwalk = require('./dirwalk.js').dirwalk;
var _ = require('lodash');

var lists = [];

dirwalk({url: "./tmp/", debugcache: true, "id": "0a"}, 
	function (err,list) {
		lists[0] = list;
		dirwalk({url: "./tmp/", debugcache: true, "id": "0b"}, cb0);
	});
function cb0(error, list) {
	console.log("0  Lists match: " + _.isEqual(lists[0], list));
}

dirwalk({url: "./tmp/", usecache: false, debugcache: true, "id": "1a"}, 
	function (err,list) {
		lists[1] = list;
		dirwalk({url: "./tmp/", usecache: false, debugcache: true, "id": "1b"}, cb1);
	});
function cb1(error, list) {
	console.log("1  Lists match: " + _.isEqual(lists[1], list));
}

