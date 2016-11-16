"use strict";

module.exports = {
	"ticketing": {
		"use_url": true,
		"request_type": "REST",
		"use_worker": false,
		"worker": "",//require your worker
		"options": {
			"url": "http://localhost:3000/completeroute",
			"method": "POST",
			"json": true,
			"qs": false,
			"gzip": false,
			"timeout": false,
			"time": false,
			"headers": {
				"auth": "Basic F5dG0="
			}
		},
		"remove_on_complete": true,
		"attempts": 3,
		"ttl": (24 * 60 * 60 * 1000), //one day
		"priority": "high", //[low, normal, medium, high, critical]
		"delay": (10 * 1000),
		"enable_retry_delay": true,
		"event_logging_enabled": false
	}
};