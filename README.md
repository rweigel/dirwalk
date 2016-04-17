## Dirwalk - Recursive HTTP and file system directory listing

- Directory listings are cached in memory.
- Filters may be applied to directories and files.
- Tested on Apache 2.2, http-server, and Node Express 4.0 directory listings.
- Uses https://github.com/thlorenz/readdirp for file system listing.

## Usage

```javascript
opts = {url: URL, ["dirpattern": PATTERN, "filepattern": PATTERN]};

dirwalk(opts, function (error, list, flat, nested) {});
```

If `URL` does not start with `http` or `https`, the file system is walked.

Example

```javascript
dirwalk({url: "./tmp/"}, 
	function (err,list,flat,nested) {
		console.log(list);
		console.log(flat);
	})
```

returns

```javascript
[ 'a/', 'a/file1', 'a/file2', 'b/', 'b/file3', 'b/file4', 'file0/' ]

{ '': [ 'a', 'b', 'file0' ],
  'a/': [ 'file1', 'file2' ],
  'b/': [ 'file3', 'file4' ] }
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
