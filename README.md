## Dirwalk - Recursive HTTP and file system directory listing

- Directory listings are cached in memory.
- Filters may be applied to directories and files.
- Tested on Apache 2.2, http-server, and Node Express 4.0 directory listings.
- Uses https://github.com/thlorenz/readdirp for file system listing.

## Usage

```
opts = {url: URL, ["dirpattern": PATTERN, "filepattern": PATTERN]};

dirwalk(opts, function (error, list, flat, nested) {});
```

If `URL` does not start with `http:` or `https`, the file system is walked.

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
