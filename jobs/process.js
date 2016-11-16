"use strict";
var queue = require("./queue");
var jobType = require("./type");
var makeRequest = require("./make_request");
var config = require(global.__base + "config");
var logger = global.__logger;

module.exports = {
	"init": init
};

function init () {
	queue.process(config.job_name, config.cuncurrent_jobs, function (job, done) {
		var body = job.data;
		var type = jobType[body.type];

		if (type.use_url) {
			makeRequest(body, type, function (err, response, body) {
				if (!err && body && body.code === 200 && body.status && body.status.result === "success") {
					logger.info({
						"job_id": job.id,
						"type": job.data.type
					}, "Jobs successfully processed");
					return done();
				}
				logger.error({
					"request": JSON.stringify(job.data),
					"response": JSON.stringify(err || body),
					"job_id": job.id
				}, "Error response from endpoint");
				return done(new Error(JSON.stringify(err || body)));
			});
		} else if (type.use_method) {
			//TODO -- not required for current task
			type.worker(body, type, function (err, result) {
				return done();
			});
		} else {
			logger.error({
				"request": JSON.stringify(job.data),
				"job_id": job.id
			}, "Job recieved but no method or url defined");
			return done();
		}
	});
	logger.info({"file": "jobs/process.js"}, "Job process module is loaded");
}