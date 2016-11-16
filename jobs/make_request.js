"use strict";

var request = require("request");

var logger = global.__logger;

function makeRequest(data, type, callback) {
	request_type[type.request_type](data, type, callback);
}
module.exports = makeRequest;

var request_type = {
	"REST": make_rest_call,
	"SOAP": make_soap_call
}

function make_rest_call (data, type, callback) {
	var options = {
		"url": type.options.url,
		"method": type.options.method,
	};
	if (type.options.json) {
		options.json = data;
	}
	if (type.options.qs) {
		options.qs = type.options.qs;
	}
	if (type.options.gzip) {
		options.gzip = type.options.gzi;
	}
	if (type.options.timeout) {
		options.timeout = type.options.timeout;
	}
	if (type.options.time) {
		options.time = type.options.time;
	}
	if (type.options.headers) {
		options.headers = type.options.headers;
	}
	logger.debug({"options": JSON.stringify(options)}, "Making http request")
	request(options, callback);
}

function make_soap_call (data, type, callback) {
	//TODO -- not required for current task
}