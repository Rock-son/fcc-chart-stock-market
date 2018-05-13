"use strict";

const { StockChart } = require("../models/StockChart");
const createHash = require("./modules/_createHash").default;
const getClientIp = require("./modules/getIp").default;

exports.getStocks = function (city) {
	return StockChart.find({city: city.toLowerCase()}, {"_id": 0, "bar": 1}, function(err, results) {
		if (err) { return res.status(400).send(err); }

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
	return StockChart.remove({ "code": code }, function(err) {
		if (err) { return err; }

		return "";
	})
	.catch(err => err);
};