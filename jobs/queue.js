"use strict";
var kue = require("kue");
var config = require(global.__base + "config");

var logger = global.__logger;

var queue = kue.createQueue({
  "disableSearch": config.redis.disableSearch,
  "redis": {
    "port": config.redis.port,
    "host": config.redis.host,
    "max_attempts": config.redis.max_attempts,
    "retry_max_delay": config.redis.retry_max_delay
  }
});

module.exports = queue;

logger.info({"file": "jobs/queue"}, "Queue module loaded");