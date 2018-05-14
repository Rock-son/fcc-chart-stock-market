"use strict";

const { StockChart } = require("../models/StockChart");
const createHash = require("./modules/_createHash").default;
const getClientIp = require("./modules/getIp").default;

exports.getAllStocks = function () {
	return StockChart.find({}, function(err, results) {
		if (err) { return err; }

		return results || [];
	});
};


exports.addStock = function (req, res, next, code) {
	return StockChart.findOne({ "code": code }, function(err, result) {
		if (err) { return err; }

		// IF STOCK DOES NOT exist - save it else return next()
		if (!result) {
			const newStock = new StockChart({
				name: "test",
				code
			});
			newStock.save(function (err) {
				if (err) { return err; }

				return "test";
			});
		} else {
			return "test";
		}
	})
	.catch(err => err);
};

exports.removeStock = function (req, res, next, code) {
	return StockChart.remove({ "code": code.toLowerCase() }, function(err) {
		if (err) { return err; }

		return "";
	})
	.catch(err => err);
};