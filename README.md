### Dirwalk - Recursive HTTP and file system directory listing with caching

- Directory listings are cached in memory.
- Filters can be applied to directories and files.
- Tested on Apache 2.2, http-server, and Node Express 4.0 directory listings.
- Uses https://github.com/thlorenz/readdirp for file system listing.

### Usage

```javascript
opts = {url: URL, ["dirpattern": REGEXP, "filepattern": REGEXP, "usecache": true]};

dirwalk(opts, function (error, list) {});
```

If `URL` does not start with `http` or `https`, the file system is walked.

### Install & Test

```bash
git clone https://github.com/rweigel/dirwalk.git
cd dirwalk
npm install
npm test
```

### Example

See also ```dirwalk-example.js```

```javascript
dirwalk({url: "./tmp/"}, function (err,list) {console.log(list);})
```

```javascript
dirwalk({url: "http://localhost:8080/tmp/"}, function (err,list) {console.log(list);})
```

```bash
node dirwalk.js --url "http://localhost:8080/tmp/"
```

```bash
node dirwalk.js --port 8004 &
sleep 2;
curl "http://localhost:8004/?url=http://localhost:8080/tmp/"
```

all return

```javascript
["a/","a/aa/","a/aa/fileaa1","a/aa/fileaa2","a/filea1","a/filea2","b/","b/fileb","fileroot"]
```