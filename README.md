# Dirwalk - Recursive HTTP directory listing

- Directory listings are cached in memory.
- Filters may be applied to directories and files.
- Tested on Apache 2.2, http-server, and Node Express 4.0 directory listings.

## Install and Test

```
npm install
npm test
```

## Example 

```js
var dirwalk = require('./dirwalk.js').dirwalk;

opts = {url: "http://mag.gmu.edu/tmp/", id: "1", debug: false, debugcache: false};

dirwalk(opts, 
	function (error, list, flat, nested) {
		console.log(list);
	});
```

Only the paramter `url` is required.  The parameter `id` is used only when one of the debug options is `true`.

See also `test.js` for examples using `filepattern` and `dirpattern` options.

## TODO

If dirpattern is given, need to use to restrict the number of requests.  At present, full directory walk is performed and directory listing filtering is then performed.  This facilitates cache hits, but causes un-needed requests to be made.