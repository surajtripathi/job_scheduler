"use strict";

module.exports = {
	"job_name": "xJob",
	"cuncurrent_jobs": 20,
	"redis": {
		"port": 6379,
	    "host": "localhost",
	    "max_attempts": 100,
	    "retry_max_delay": 5 * 1000,
	    "disableSearch": true,
	}
};
