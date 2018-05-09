"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");


// DEFINE MODEL
const stockChart = new Schema({

	stock: {
		type: String, required: true, trim: true, lowercase: true
	},
	data: [String],
	updatedUTC: { type: Date }
});

// UPDATE TIME
goingUsersSchema.pre("save", function a(next) {
	this.updatedUTC = Date.now();
	return next();
});

module.exports.StockChart = mongoose.model("StockChart", stockChart, "stockchart_going_users");
