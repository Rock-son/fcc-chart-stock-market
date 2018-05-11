"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");


// DEFINE MODEL
const stockChart = new Schema({

	name: {
		type: String, required: true, trim: true, lowercase: true
	},
	code: {
		type: String, required: true, trim: true, lowercase: true
	},
	updatedUTC: { type: Date }
});

// UPDATE TIME
stockChart.pre("save", function a(next) {
	this.updatedUTC = Date.now();
	return next();
});

module.exports.StockChart = mongoose.model("StockChart", stockChart, "stockchart_going_users");
