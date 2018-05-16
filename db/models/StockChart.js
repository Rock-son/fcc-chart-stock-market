"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");


// DEFINE MODEL
const stockChart = new Schema({

	name: {
		type: String, required: true, trim: true
	},
	code: {
		type: String, required: true, trim: true, upperCase: true
	},
	quote: {
		type: Object
	},
	chart: {
		id: { type: String, trim: true, upperCase: true },
		values: {
			type: Schema.Types.Mixed
		}
	},
	updatedUTC: { type: Date }
});

// UPDATE TIME
stockChart.pre("save", function a(next) {
	this.updatedUTC = Date.now();
	return next();
});

module.exports.StockChart = mongoose.model("StockChart", stockChart, "stockchart_stocks");
