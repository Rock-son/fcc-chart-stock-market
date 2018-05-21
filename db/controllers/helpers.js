"use strict";

const axiosJS = require("./modules/axios");
const db = require("./controller");

const duration = "6m";

function formatData(response) {
	return {
		code: response.quote.symbol,
		quote: response.quote,
		data: {
			id: response.quote.symbol,
			values: response.chart.map(item => ({ date: item.date, price: item.close }))
		}
	};
}


// DATA OLDER THAN A DAY
exports.refreshAndReturnData = function b(res, symbol) {
	let dbStocks = null;
	let promises = null;
	let updatePromises = null;
	const code = (symbol || "").toUpperCase();

	db.getAllStockCodes()
		.then((response) => {
			if (!response.length && !code) { return res.send(""); }

			dbStocks = response.map(item => item.code);
			// UPDATE ALL DATA AND SAVE NEW STOCK - IF STOCK NOT ALREADY IN DB
			if (code && dbStocks.indexOf(code) === -1) {
				return axiosJS.get(code, duration)
					.then((respApi) => {
						if (respApi.data === "Unknown symbol") {
							return res.status(400).send("Unkown symbol");
						}

						promises = dbStocks.map(stock => axiosJS.get(stock, duration)); // API CALL
						Promise.all(promises)
							.then((apiResults) => {
								const data = apiResults.map(item => item.data);

								updatePromises = data.map(item => db.updateStock(item.quote.symbol, item));
								updatePromises.push(db.addStock(respApi.data.quote.symbol, respApi.data));

								return Promise.all(updatePromises)	// DB CALL
									.then(updateResult => res.send(updateResult.map(item => ({ quote: item.quote, chart: item.chart }))))
									.catch(err => res.status(400).send({ error: err.message }));
							})
							.catch(err => res.status(400).send({ error: err.message }));
					})
					.catch(err => res.status(400).send({ error: err.message }));
			}
			// NO NEW STOCK, JUST UPDATE DB DATA
			promises = dbStocks.map(stock => axiosJS.get(stock, duration));
			Promise.all(promises)
				.then((apiResults) => {
					const data = apiResults.map(item => item.data);

					updatePromises = data.map(item => db.updateStock(item.quote.symbol, item));
					return Promise.all(updatePromises)
						.then(updateResult => res.send(updateResult.map(item => ({ quote: item.quote, chart: item.chart }))))
						.catch(err => res.status(400).send({ error: err.message }));
				})
				.catch(err => res.status(400).send({ error: err.message }));
		})
		.catch(err => res.status(400).send({ error: err.message }));
};


// DATA NOT OLDER THAN A DAY
exports.mergeAndReturnData = function c(res, symbol) {
	let dbStocks = null;
	const stock = (symbol || "").toUpperCase();

	db.getAllStockCodes()
		.then((response) => {
			if (!response.length && !stock) { return res.send(""); }

			dbStocks = response.map(item => item.code);
			// IF STOCK NOT ALREADY IN DB - MAKE API CALL, SAVE IT AND RETURN COMBINED DATA
			if (stock && dbStocks.indexOf(stock) === -1) {
				return axiosJS.get(stock, duration)	// API CALL
					.then((respApi) => {
						if (respApi.data === "Unknown symbol") {
							return res.status(400).send("Unkown symbol");
						}
						db.getAllData()
							.then((respDB) => {
								return db.addStock(stock, respApi.data) //	ELSE SAVE TO DB
									.then((_resp_) => {
										const newStockData = [{ quote: _resp_.quote, chart: _resp_.chart }];
										return res.send(respDB.concat(newStockData)); 	//	RETURN COMBINED
									})
									.catch(err => res.status(400).send({ error: err.message }));
							})
							.catch(err => res.status(400).send({ error: err.message }));
					})
					.catch(err => res.status(400).send({ error: err.message }));
			}
			// IF NO NEW STOCK OR IS ALREADY IN DB - JUST RETURN ALL DATA FROM DB
			return db.getAllData()
				.then(resp => res.send(resp)) // RETURN ONLY DB DATA
				.catch(err => res.status(400).send({ error: err.message }));
		})
		.catch(err => res.status(400).send({ error: err.message }));
};
