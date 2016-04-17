## Dirwalk - Recursive HTTP and file system directory listing

- Directory listings are cached in memory.
- Filters may be applied to directories and files.
- Tested on Apache 2.2, http-server, and Node Express 4.0 directory listings.
- Uses https://github.com/thlorenz/readdirp for file system listing.

## Usage

```javascript
opts = {url: URL, ["dirpattern": PATTERN, "filepattern": PATTERN]};

dirwalk(opts, function (error, list) {});
```

If `URL` does not start with `http` or `https`, the file system is walked.

Example in dirwalk-example.js

```javascript
dirwalk({url: "./tmp/"}, function (err,list) {console.log(list);})
dirwalk({url: "http://localhost:8080/tmp/"}, function (err,list) {console.log(list);})
```
returns

```javascript
["a/","a/aa/","a/aa/fileaa1","a/aa/fileaa2","a/filea1","a/filea2","b/","b/fileb","fileroot"]

["a/","a/aa/","a/aa/fileaa1","a/aa/fileaa2","a/filea1","a/filea2","b/","b/fileb","fileroot"]
```

## Install

```
npm install
```

## Test

```
npm test
```

## Examples

```
node dirwalk-example.js
```
