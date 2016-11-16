global.__base = __dirname + '/';

var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var bunyan = require("bunyan");
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var log = bunyan.createLogger({name: "job_scheduler", level: "info"});
var port = (process.env.PORT || "3100");
global.__logger = log

//this is not required for master
var create = require("./jobs/create");
require("./jobs/process").init();

//job processing endpoint
app.post("/createjob", function(req, res, next) {
	create.createJob(req.body, function(err, job_id) {
		if (err) {
			res.send({"error": JSON.stringify(err)})
		}
		res.send(job_id);
	});
});
var http_server = http.createServer(app);
http_server.listen(port);
http_server.on("listening", function () {
	var address = http_server.address();
	log.info(address, "http server has started");
});

process.on("uncaughtException", function(err) {
	log.error('Something broke!!! - ' + err.stack);
});

