"use strict";

const axios = require("axios");

exports.get = (stock, duration) => 
	axios({
		method: "get",
		url: `https://cloud.iexapis.com/stable/stock/${stock}/batch?types=quote,chart&range=${duration}&token=${process.env.API_TOKEN}`,
		timeout: 2000,
		validateStatus: status => status < 500 // Reject if the status code < 500
	});
