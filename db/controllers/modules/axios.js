"use strict";

const axios = require("axios");

exports.get = (stock, duration) =>
	axios({
		method: "get",
		url: `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,chart&range=${duration}`,
		timeout: 2000,
		validateStatus: status => status < 500 // Reject if the status code < 500
	});
