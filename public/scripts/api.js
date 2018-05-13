"use strict";

import axios from "axios";

const validateStatus = () => status => status < 500; // Reject if the status is > 500

export default {

	addStock: stock => axios({
		method: "post",
		url: "api/addStock",
		data: {
			stock
		},
		headers: {
			"Content-Type": "application/json"
		},
		validateStatus
	}),
	removeStock: stock => axios({
		method: "post",
		url: "api/removeStock",
		data: {
			stock
		},
		headers: {
			"Content-Type": "application/json"
		},
		validateStatus
	})
};
