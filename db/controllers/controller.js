"use strict";

const { StockChart } = require("StockChart");
const createHash = require("./modules/_createHash").default;
const getClientIp = require("./modules/getIp").default;

exports.getStocks = function (city) {
	return StockChart.find({city: city.toLowerCase()}, {"_id": 0, "bar": 1}, function(err, results) {
		if (err) { return res.status(400).send(err); }

		return results || [];
	});
};


exports.addStock = function (req, res, next, data) {

	StockChart.findOne({ 'bar.id': data.id }, function(err, result) {
		if (err) { return res.status(400).send(err); }

		// IF BAR exists
		if (result) {
			// if USER exist in bar array - return unchanged, else add and save
			if (result.bar.users.indexOf(data.user) > -1) {
				return res.status(200).send({ users: result.bar.users.slice(), id: data.id });
			} else {
				result.bar.users = result.bar.users.slice().concat(data.user);
				result.save(function (err) {
					if (err) { return res.status(400).send(err); }

					return res.status(200).send({ users: result.bar.users, id: data.id });
				});
			}
		} else {
			// IF BAR NOT exists - make and save new bar
			const newBar = new StockChart({
				city: data.city,
				bar: {
					id: data.id,
					users: [data.user]
				}
			});
			newBar.save(function (err) {
				if (err) { return res.status(400).send(err); }

				return res.status(200).send({ users: newBar.bar.users.slice(), id: data.id });
			})
		}
	})
	.catch(err => res.status(400).send(err));
};

exports.removeGoingUsers = function (req, res, next, data) {

	StockChart.findOne({ "bar.id": data.id }, function(err, result) {
		if (err) { return err; }

		// if BAR exists
		if (result) {
			// if USER exist - remove them and save, else return same array
			let idx = null;
			if ((idx = result.bar.users.indexOf(data.user)) > -1) {
				result.bar.users = result.bar.users.slice(0, idx).concat(result.bar.users.slice(idx + 1));
				result.save(function (err) {
					if (err) { return res.status(402).send(err); }

					return res.status(200).send({ users: result.bar.users.slice(0), id: data.id });
				});
				return;
			} else {
				return res.status(200).send({ users: [], id: "" });
			}
		}
		// IF BAR NOT exists
		return res.status(200).send({ users: [], id: "" });
	});
};