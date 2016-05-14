### Dirwalk - Recursive HTTP and file system directory listing with caching

- Directory listings are cached in memory.
- Filters can be applied to directories and files.
- Tested on Apache 2.2, http-server, and Node Express 4.0 directory listings.
- Uses https://github.com/thlorenz/readdirp for file system listing.

### Usage

```javascript
opts = {url: URL, ["dirpattern": REGEXP, "filepattern": REGEXP, "usecache": true, "recursive": true, "includedirs": false]};

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

### Basic Example

See also ```dirwalk-example.js```

```javascript
dirwalk({url: "./tmp/"}, function (err,list) {console.log(list);})
```

The following examples require starting a server using
```
node_modules/http-server/bin/http-server -p 8080 &
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
["a/aa/fileaa1","a/aa/fileaa2","a/filea1","a/filea2","b/fileb","fileroot"]
```

### Other examples

```bash
node dirwalk.js --url "http://localhost:8080/tmp/" --includedirs true --recursive false
```

```bash
node dirwalk.js --url "tmp/" --includedirs true --recursive false
```