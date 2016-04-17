var request = require('request');
var express = require('express');
var app     = express();
var cheerio = require('cheerio');
var urlp    = require('url');

var readdirp = require('readdirp')
var path     = require('path')
var es       = require('event-stream');

var fs = require('fs');

var cache = {};

if (1) {
if (process.argv[1].slice(-10) === "dirwalk.js") {

	function s2b(str) {if (str === "true") {return true} else {return false}}
	function s2i(str) {return parseInt(str)}
	function ds() {return (new Date()).toISOString() + " [dirwalk] "}

	var argv     = require('yargs')
	                .default
						({
							'url': "",
							'dirpattern': "",
							'filepattern': "",
							'debug': "",
							'debugcache': "",
							'port': ""
						})
						.argv

	var options = 
		{
			"url": argv.url, 
			"filepattern": argv.filepattern, 
			"dirpattern": argv.dirpattern, 
			"debug": s2b(argv.debug), 
			"debugcache": s2b(argv.debugcache)
		};

	if (options.url !== "") {
		dirwalk(options, 
			function (err, list) {
				console.log(JSON.stringify(list));
			})
	}

	var port = argv.port;

	// Only start server if port given
	if (port !== "") {

		app.listen(port)
		console.log(ds() + "Listening on port " + port + ".");

		// Main entry route
		app.get('/', function (req, res) {
			if (Object.keys(req.query).length === 0) {
				// If no query parameters, return index.htm
				res.contentType("html")
				res.send(fs.readFileSync(__dirname+"/index.htm"))
			} else {
				// Call main entry function
				var addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
				if (req.originalUrl.toString().indexOf("istest=true") == -1) {
					console.log(ds() + "Request from " + addr + ": " + req.originalUrl)
				}
			}
			var options = {}

			options.url         = decodeURIComponent(req.query.url);
			options.filepattern = req.query.filepattern || "";
			options.dirpattern  = req.query.dirpattern  || "";
			options.debug       = req.query.debug       || false;
			options.debugcache  = req.query.debugcache  || false;

			dirwalk(options, 
				function (err, list) {
					res.send(list);
				})

		})
	}
}
}

function getcache(key, cb) {
	cb("", cache[key].list);
}

function writecache(key, list) {
	cache[key] = {};
	cache[key].ready  = false;
	cache[key].list   = list;
	cache[key].ready  = true;
}

function dirwalk(opts, path, cb) {

	if (typeof(opts) === "object") {
		// Although default is trailing slash in url and no leading slash
		// in dirpattern, here we reverse that. For internal processing.

		var url          = opts.url;
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
		opts.base = urlp.parse(opts.url).path.replace(/^\//, "");
	}

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
		if (debug) console.log(id + "dirwalk called with opts = " + JSON.stringify(opts));
		var cb = path;
		opts.cb = cb;

		path = "";
		if (cache[key]) {
			if (cache[key].ready) { // Needed?
				if (debugcache) console.log(id + "Direct cache hit for " + key)
				cb("", cache[key].list);
				return;
			}
		}
		if (cache[url]) {
			if (cache[url].ready) { // Needed?
				if (debugcache) console.log(id + "Indirect cache hit for " + key);
				finish(opts, cache[url].list);
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
				dirwalk[url] = {id: id, list: [], Nr: 0, Nc: 0};
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
			dirwalk[key] = {id: id, list: [], Nr: 0, Nc: 0};
		}
	} else {
		if (debug) console.log(id + "dirwalk called with path = " + path + " and opts = " + JSON.stringify(opts));
	 	dirwalk[key].Nr = dirwalk[key].Nr + 1; // Number of requests.
		url = url + path;
	}

	if (url.match("http://") || url.match("https://")) {
		// HTTP walk
		if (debug) console.log(id + "Input path: " + path);
		doget(url, path);
	} else {
		// Local file system walk
		var list = [];
		var stream = readdirp({ root: url, "entryType": "both"});
		stream
			.on('warn', function (err) { 
				console.error('non-fatal error', err); 
			})
			.on('error', function (err) { console.error('fatal error', err); })
			.on('end', function () {
				finish(opts,list)
			})
			.pipe(es.mapSync(function (entry) {
				var isdir = fs.lstatSync(url + entry.path).isDirectory();
				tail = "";
				if (isdir) {
					var tail = "/";
				}
				if (0) {
					console.log("name:   " + entry.name)
					console.log("path:   " + entry.path)
					console.log("parent: " + entry.parentDir)
					console.log("is dir  " + isdir);
				}
				//console.log(entry)
				list.push(entry.path+tail);
			}))
			// TODO: Modify http code so it does streaming too.
			//.pipe(es.stringify())
			//.pipe(process.stdout);
	}

	function doget(url, path) {
		var request = require("request");
		var getopts = {method: 'GET', uri: url, gzip: true, pool: {maxSockets: 5}};
		if (debug) console.log(id + "Requesting " + url);
		var pathr = path.replace(/\/$/,"")
		request.get(getopts, function (error, response, body) {

			if (error) {
				if (debug) console.log(error);
				console.log(url + " " + path);
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
						if (debug) console.log(id + "  Found .. in path.");
						if (debug) console.log(id + "   Ignoring.");
						isdir = false;
					} else {
						if (href.length > opts.base.length + path.replace(/^\//, "").length) {
							isdir = true;
							isabs = true;
							var rep = "/" + opts.base + path;
							href = href.replace(rep, "");
							if (debug) console.log(id + "   Path is absolute.");
							if (debug) console.log(id + "   Removing " + rep + " in href." + " New href = " + href)
							if (debug) console.log(id + "   isfile = " + isfile + "; isdir = " + isdir + "; isabs = " + isabs);
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
							var rep = "/" + opts.base + path;
							href = href.replace(rep, "");
							if (debug) console.log(id + "   Path is absolute.");
							if (debug) console.log(id + "   Removing " + rep + " in href." + " New href = " + href)
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

				// Node express 4.0 serve-index qdirectory listing.
				if (!ignore && typeof(aclass) === "string") {
					// Node express 4.0 directory hrefs don't have trailing /
					// but do indicate directory in class.
					if (aclass.match("icon-directory")) {
						if (debug) console.log(id + "   href could be a directory.");
						if (href === opts.base.replace(/\/$/, "")) {
							isdir = false;
							isfile = false;
							if (debug) console.log(id + "   href is equal to base.  Ignoring");
						} else {
							isdir = true;
							isfile = false;
							href = href.replace(/\/$/) + "/";
							if (debug) console.log(id + "   href is a directory.");
							if (debug) console.log(id + "   Modified href = " + href);
						}
					}
				}

				if (isdir) {
					newpath = path + href;

					if (href !== "") {
						if (debug) console.log(id + "   Adding " + newpath + " to dirwalk[" + key + "].list");
						dirwalk[key].list.push(path + href);
						if (debug) {
							console.log(id + "   Calling dirwalk with path = " + newpath);
						}
						dirwalk(opts, newpath, cb);
					} else {
						if (debug) console.log(id + "   Not adding empty path + href to dirwalk[" + key + "].list");						
						if (debug) {
							console.log(id + "   Not calling dirwalk with empty path + href.");
						}
					}

				} else if (isfile) {
					if (!dirwalk[key].list) {
						dirwalk[key].list = [];
					}
					if (href !== "") {
						if (debug) console.log(id + "   Adding " + path + href + " to dirwalk[" + key + "].list");
						dirwalk[key].list.push(path + href);
					} else {
						if (debug) console.log(id + "   Not adding empty path + href to dirwalk[" + key + "].list");						
					}
				}
			})
			if (debug) {
				console.log(id + "Finished processing response from "
								+ response.request.uri.href);
			}
			if (dirwalk[key].Nr == dirwalk[key].Nc) {
				finish(opts, dirwalk[key].list);
			}
	    	dirwalk[key].Nc = dirwalk[key].Nc + 1;

		})
	}

	function finish(opts, list) {

		if (opts.cb) {
			var cb = opts.cb;
		}

		if (debug) console.log(opts.id + " finish() callback.")

		// Needed for async.
		if (dirwalk[opts.url]) {
			if (dirwalk[opts.url].onfinish) {
				while (dirwalk[opts.url].onfinish.length > 0) {
					copts = dirwalk[opts.url].onfinish.shift();
					if (debug) {
						console.log(opts.id +
							 " Found URL callback for " + copts.id + ".");
					}
					finish(copts, list);
				}
			}
		}

		if (opts.dirpattern !== "") {
			// Reduce list array.  See above method to avoid creating copy of list.
			var listr = [];
			var kr = 0;
			var lo = list.length;
			for (k = 0; k < lo; k++) {
				if (list[k].match(new RegExp(opts.dirpattern))) {
					listr[kr] = list[k]
					kr = kr+1;
				}
			}
		}

		if (opts.filepattern !== "") {
			// Reduce list array.
			var listr = listr || [];
			var kr = 0;
			var lo = list.length;
			for (k = 0; k < lo; k++) {
				if (list[k].match(new RegExp(opts.filepattern))) {
					listr[kr] = list[k]
					kr = kr+1;
				}
			}
		}

		if (typeof(listr) === "undefined") {
			list.sort();
			writecache(opts.key, list);
			cb("", list);
		} else {
			listr.sort();
			writecache(opts.key, listr);
			cb("", listr);
		}

		if (dirwalk[opts.key]) {
			if (dirwalk[opts.key].onfinish) {
				while (dirwalk[opts.key].onfinish.length > 0) {
					copts = dirwalk[opts.key].onfinish.shift();
					console.log(opts.id + " Found key callback for " + copts.id + ".");
					finish(copts, list);
				}
			}
		}

	}
}
exports.dirwalk = dirwalk