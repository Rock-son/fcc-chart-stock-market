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
// GETUPDATETIME FINDS THE FIRST ONE, WHICH IS ALSO THE OLDEST!
exports.getUpdateTime = function (code) {
	return StockChart.findOne({}, {_id: 0, updatedUTC: 1}, { sort: { updatedUTC: 1}}, function(err, result) {
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


exports.addStock = function (code, stockData) {

	return StockChart.findOne({ code })
		.then(result => {
			// IF STOCK DOES NOT exist - save it else return next()
			if (stockData) {
				const newStock = new StockChart({
					name: stockData.quote.companyName,
					code: stockData.quote.symbol,
					quote: {
						code: stockData.quote.symbol,
						change: stockData.quote.change,
						changePercent: stockData.quote.changePercent * 100,
						close: stockData.quote.close,
						companyName: stockData.quote.companyName,
						latestTime: stockData.quote.latestTime,
					},
					chart: {
						id: stockData.quote.symbol,
						values: stockData.chart.map(row => ({ date: row.date, price: row.close}))
					}
				});
				return newStock.save(function(err) {
					if (err) { return err; }

					return newStock;
				});
			} else {
				return new Error('No stock data supplied!');
			}
		})
		.catch(err => {error: err.message})
};


exports.updateStock = function (code, stockData) {

	return StockChart.findOneAndUpdate({ code }, {
			quote: {
				code: stockData.quote.symbol,
				change: stockData.quote.change,
				changePercent: stockData.quote.changePercent * 100,
				close: stockData.quote.close,
				companyName: stockData.quote.companyName,
				latestTime: stockData.quote.latestTime,
			},
			chart: {
				id: stockData.quote.symbol,
				values: stockData.chart.map(row => ({ date: row.date, price: row.close }))
			},
			updatedUTC: Date.now()
		})
		.then(result => {
			return result;
		})
		.catch(err => {error: err.message})
};