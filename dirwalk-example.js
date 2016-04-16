var dirwalk = require('./dirwalk.js').dirwalk;

dirwalk({url: "http://localhost:8080/tmp/"}, cb);
//dirwalk({url: "./tmp/"}, cb);

//dirwalk({url: "http://localhost:8080/tmp/a/"}, cb);
//dirwalk({url: "./tmp/a/"}, cb);

function cb(error, list, flat, nested) {
	console.log(list);
	console.log(flat);
	console.log("---")
	//console.log(nested);
}
