"use strict";

const { StockChart } = require("../models/StockChart");
const createHash = require("./modules/_createHash").default;
const getClientIp = require("./modules/getIp").default;

exports.getAllStockCodes = function () {
	return StockChart.find({}, {_id: 0, code: 1}, function(err, results) {
		if (err) { return err; }

		return results || [];
	})
	.catch(err => ({error: err.message}));
};

exports.getAllData = function () {
	return StockChart.find({}, {_id: 0, quote: 1, chart: 1 }, function(err, results) {
		if (err) { return err; }

		return results || [];
	})
	.catch(err => ({error: err.message}));
};

exports.getUpdateTime = function (code) {
	return StockChart.findOne({}, {_id: 0, updatedUTC: 1}, function(err, result) {
		if (err) { return err; }

		return result;
	})
	.catch(err => ({error: err.message}));
};

exports.removeStock = function (code) {
	return StockChart.remove({ "code": code.toUpperCase() }, function(err) {
		if (err) { return err; }

		return "";
	})
	.catch(err => ({error: err.message}));
};

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