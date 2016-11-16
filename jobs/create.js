"use strict";
var queue = require("./queue");
var jobType = require("./type");
var config = require(global.__base + "config");

var logger = global.__logger;

function createJob (param, callback) {
	var type = jobType[param.type];
	if (!type) {
		logger.error({
			"request": JSON.stringify(param),
		}, "Can not create job for undefined type");
		return callback("type undefined");
	}

	var job = queue.create(config.job_name, param);
	if (type.remove_on_complete) {
		job.removeOnComplete(true);
	}
	if (type.attempts) {
		job.attempts(type.attempts);
	}
	if (type.ttl) {
		job.ttl(type.ttl);
	}
	if (type.priority) {
		job.priority(type.priority);
	}
	if (type.delay) {
		job.delay(type.delay);
	}
	if (type.enable_retry_delay) {
		job.backoff(type.enable_retry_delay)
	}
	job.save(function (err) {
		if (!err) {
			logger.info({"job_id": job.id}, "Job saved");
		} else {
			logger.error({"error": JSON.stringify(err), "job_id": job.id}, "Error while saving the job");
		}
		callback(err, {"id": job.id});
	});

	if (type.event_logging_enabled) {
		job.on('complete', function(result){
		  logger.info({"result": JSON.stringify(result), "job_id": job.id},"Job completed with data");
		}).on('failed attempt', function(errorMessage, doneAttempts){
		  logger.error({"error": errorMessage, "attempts": doneAttempts, "job_id": job.id}, 'Job failed');
		}).on('failed', function(errorMessage){
		  logger.error({"error": errorMessage, "job_id": job.id}, 'Job failed');
		}).on('progress', function(progress, data){
		  logger.info({"job_id": job.id, "progress": (progress + "%"), "data": JSON.stringify(data)}, "Job progress details");
		});
	}
}

module.exports = {
	"createJob": createJob
}

logger.info({"file": "jobs/create.js"}, "Job create module is loaded");