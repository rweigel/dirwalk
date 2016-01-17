var request = require('request');
var cheerio = require('cheerio');
var urlp    = require('url');

request.debug = true 

var cache = {};

function getcache(key, cb) {
	cb("", cache[key].list, cache[key].flat, cache[key].nested);
}

function writecache(key, list, flat, nested) {
	cache[key] = {};
	cache[key].ready  = false;
	cache[key].list   = list;
	cache[key].flat   = flat;
	cache[key].nested = nested;
	cache[key].ready  = true;
}

function dirwalk(opts, path, cb) {

	if (typeof(opts) === "object") {
		var url          = opts.url.replace(/\/$/,"");
		opts.debug       = opts.debug       || false;
		opts.debugcache  = opts.debugcache  || false;
		opts.filepattern = opts.filepattern || "";
		opts.dirpattern  = opts.dirpattern  || "";
		opts.id          = opts.id          || "";
	} else {
		var url  = opts;
		var opts = {id: "", url: url, debug: false, debugcache: false, filepattern: "", dirpattern: ""};
	}

	if (typeof(opts.base) === "undefined") {
		opts.base = urlp.parse(opts.url).path;
	}

	opts.url = opts.url.replace(/\/$/,"");

	var debug       = opts.debug;
	var debugcache  = opts.debugcache;
	var filepattern = opts.filepattern;
	var dirpattern  = opts.dirpattern;
	var id          = opts.id;

	if (id !== "") {
		id = id + " ";
	}

	var key = opts.url + opts.filepattern + opts.dirpattern;
	opts.key = key;

	if (typeof(qs) === "string") {
		qo = parseQueryString(qs)
	}

	if (arguments.length == 2) {
		var cb = path;
		opts.cb = cb;

		path = "/";
		if (cache[key]) {
			if (cache[key].ready) { // Needed?
				if (debugcache) console.log(id + "Direct cache hit for " + key)
				cb("", cache[key].list, cache[key].flat, cache[key].nested);
				return;
			}
		}
		if (cache[url]) {
			if (cache[url].ready) { // Needed?
				if (debugcache) console.log(id + "Indirect cache hit for " + key)
				finish(opts, cache[url].list, cache[url].flat);
				return;			
			}
		}
		if (debugcache) console.log(id + "No cache hit for " + key);
		if (key !== url) {
			if (typeof(dirwalk[url]) === "object") {
				if (dirwalk[url].id) {
					if (debug) console.log(id + "ID = " + dirwalk[url].id 
						+ " is already processing request for " + url);
				}
				if (!dirwalk[url].onfinish) {
					dirwalk[url].onfinish = [opts];
				} else {
					dirwalk[url].onfinish.push(opts);
				}
				return;
			} else {
				dirwalk[url] = {id: id, flat: {}, list: [], Nr: 0, Nc: 0};
			}
		}
		if (typeof(dirwalk[key]) === "object") {
			if (dirwalk[key].id) {
				if (debug) console.log(id + "ID = " + dirwalk[key].id 
					+ " is already processing request for " + key);
			}
			if (!dirwalk[key].onfinish) {
				dirwalk[key].onfinish = [opts];
			} else {
				dirwalk[key].onfinish.push(opts);
			}
			return;
		} else {
			dirwalk[key] = {id: id, flat: {}, list: [], Nr: 0, Nc: 0};
		}
	} else {
	 	dirwalk[key].Nr = dirwalk[key].Nr + 1; // Number of requests.
		url = url + path;
	}

	if (debug) console.log(id + "Input path: " + path);
	doget(url, path);

	function doget(url, path) {
		var request = require("request");
		var getopts = {method: 'GET', uri: url, gzip: true, pool: {maxSockets: 5}};
		if (debug) console.log(id + "Requesting " + url);
		request.get(getopts, function (error, response, body) {

			if (error) {
				if (debug) console.log(error);
				console.log(url + " " + path);
				dirwalk[key].flat[path] = error;
		    	dirwalk[key].Nc = dirwalk[key].Nc + 1;
				return;
			}

			if (debug) {
				console.log(id + "Received response from " 
							+ response.request.uri.href);
			
				console.log(id + "Start processing response from "
							+ response.request.uri.href);
			}

			//console.log(id + "--- Response ---")
			//console.log(response)
			$ = cheerio.load(body);
			//if (debug) console.log(id + "--- Body ---")
			//if (debug) console.log(body);
			links = $('a');
			var href = "";
			
			if (debug) console.log(id + "Base = " + opts.base + "; Path = " + path);


			$(links).each(function(i, link) {
				href = $(link).attr('href');
				aclass = $(link).attr('class');
 				if (debug) console.log(id + "  href = " + href + "; class = " + aclass);

				var isdir  = false;
				var isabs  = false;
				var isfile = false;
				var ignore = false;

				if (!href.match(/^\//) && href.match(/\/$/)) {
					// A relative path if href does not
					// start with / and ends with /
					isdir = true;
					if (debug) console.log(id + "  Found Relative path.")
					if (debug) console.log(id + "  isfile = " + isfile + "; isdir = " + isdir + "; isabs = " + isabs);
				}
				if (href.match(/^\//) && href.match(/\/$/) && href.match(opts.base)) {
					// An absolute path if href starts with / and ends with /
					if (href.match(/\.\./)) {
						if (debug) console.log(id + "  Found .. in path.  Ignoring.")
						isdir = false;
					} else {
						if (href.length > opts.base.length + path.replace(/^\//,"").length) {
							isdir = true;
							isabs = true;
							href = href.replace(opts.base.replace(/\/$/,"") + path,"");
							if (debug) console.log(id + "  Found absolute path.  New href = " + href);
							if (debug) console.log(id + "  isfile = " + isfile + "; isdir = " + isdir + "; isabs = " + isabs);
						} else {
							ignore = true;
							isfile = false;
							isdir = false;
							if (debug) console.log(id + "   Found href + path length <= base.  Ignoring.");
						}
					}
				}

				if (href === opts.base) {
					isdir = false;
					isfile = false;
					if (debug) console.log(id + "  href is equal to base.  Ignoring");
				}

				if (!isdir && !href.match(/\/$/)) {
					if (href.match(/^\//)) {
						if (href.length > opts.base.length + path.replace(/^\//,"").length) {
							isfile = true;
							isabs = true;
							href = href.replace(opts.base,"/").replace(path,"");
							if (debug) console.log(id + "   Found absolute file. New href = " + href);
							if (debug) console.log(id + "   isfile = " + isfile + "; isdir = " + isdir + "; isabs = " + isabs);
						} else {
							ignore = true;
							isfile = false;
							isdir = false;
							if (debug) console.log(id + "   Found href + path length <= base.  Ignoring.");
						}
					} else {
						isfile = true;
						href = href.replace(opts.base,"");
						if (debug) console.log(id + "   Found relative file. New href = " + href);
						if (debug) console.log(id + "   isfile = " + isfile + "; isdir = " + isdir + "; isabs = " + isabs);
					}
				}
				
				if (href.match(/^http/)) {
					if (debug) console.log(id + "   Found http link. Ignoring.");
					isdir = false;
					isfile = false;
				}

				if (!ignore && typeof(aclass) === "string") {
					// Node express 4.0 directory hrefs don't have trailing /
					// but do indicate directory in class.
					if (aclass.match("icon-directory")) {
						if (debug) console.log(id + "   href could be a directory.");
						if (href === opts.base.replace(/\/$/,"")) {
							isdir = false;
							isfile = false;
							if (debug) console.log(id + "   href is equal to base.  Ignoring");
						} else {
							isdir = true;
							isfile = false;
							href = href.replace(opts.base,"/");
							if (debug) console.log(id + "   href is a directory.");
							if (debug) console.log(id + "   Modified href = " + href);
						}
					}
				}

				if (isdir) {
					newpath = path + href;
					if (debug) {
						console.log(id + "  Calling dirwalk with path = " + newpath);
					}
					dirwalk[key].flat[newpath] = [];
					dirwalk(opts, newpath, cb);
				} else if (isfile) {
					if (!dirwalk[key].flat[path]) {
						dirwalk[key].flat[path] = [];
					}
					if (!dirwalk[key].list) {
						dirwalk[key].list = [];
					}
					dirwalk[key].list.push(path + href);
					dirwalk[key].flat[path].push(href);						
				}
			})
			if (debug) {
				console.log(id + "Finished processing response from "
								+ response.request.uri.href);
			}
			if (dirwalk[key].Nr == dirwalk[key].Nc) {
				finish(opts, dirwalk[key].list, dirwalk[key].flat);
			}
	    	dirwalk[key].Nc = dirwalk[key].Nc + 1;

		})
	}

	function finish(opts, list, flat) {

		if (opts.cb) {
			var cb = opts.cb;
		}

		if (debug) console.log(opts.id + " finish() callback.")

		if (debug) console.log(opts.id + " Done.");
		var nested = {};
		for (flatkey in flat) {
			if (flatkey.match(new RegExp(opts.dirpattern))) {
				stringToObj(flatkey.replace(/^\/|$\//,""), flat[flatkey], nested);
			} else {
				delete flat[flatkey];
			}
		}

		writecache(opts.url, list, flat, nested);

		if (dirwalk[opts.url]) {
			if (dirwalk[opts.url].onfinish) {
				while (dirwalk[opts.url].onfinish.length > 0) {
					copts = dirwalk[opts.url].onfinish.shift();
					if (debug) console.log(opts.id + " Found URL callback for " + copts.id + ".");
					finish(copts, list, flat);
				}
			}
		}

		if (opts.dirpattern !== "") {
			var listr = [];
			var kr = 0;
			var lo = list.length;
			for (k = 0; k < lo; k++) {
				if (list[k].match(new RegExp(opts.dirpattern))) {
					listr[kr] = list[k]
					kr = kr+1;
				}
			}
			//console.log(listr);
		}
		if (opts.filepattern !== "") {
			var listr = listr || [];
			var kr = 0;
			var lo = list.length;
			for (k = 0; k < lo; k++) {
				if (list[k].match(new RegExp(opts.filepattern))) {
					listr[kr] = list[k]
					kr = kr+1;
				}
			}
			//console.log(listr)
		}

		if (typeof(listr) === "undefined") {
			list.sort();
			writecache(opts.key, list, flat, nested);
			cb("", list, flat, nested);
		} else {
			listr.sort();
			writecache(opts.key, listr, flat, nested);
			cb("", listr, flat, nested);
		}

		if (dirwalk[opts.key]) {
			if (dirwalk[opts.key].onfinish) {
				while (dirwalk[opts.key].onfinish.length > 0) {
					copts = dirwalk[opts.key].onfinish.shift();
					console.log(opts.id + " Found key callback for " + copts.id + ".");
					finish(copts, list, flat);
				}
			}
		}

	}

	//http://stackoverflow.com/questions/22985676/convert-string-with-dot-notation-to-json
	stringToObj = function(path, value, obj) {
		var parts = path.split("/");
		var part;
		var last = parts.pop();
		while (part = parts.shift()) {
			if (typeof obj[part] != "object") {
				obj[part] = {};
			}
			obj = obj[part];
		}
		obj[last] = value;
	}
}
exports.dirwalk = dirwalk