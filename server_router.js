"use strict";

const path = require("path");
const helper = require("./db/controllers/helpers");
const db = require("./db/controllers/controller");
const mongoSanitize = require("mongo-sanitize");

const { STOCK_ADD, STOCK_REMOVE } =
{
	STOCK_ADD: "STOCK_ADD",
	STOCK_REMOVE: "STOCK_REMOVE",
	CONNECT: "CONNECT"
};

// eslint-disable-next-line func-names
module.exports.default = function (app, io) {
	function connectionHandler(socket) {
		// eslint-disable-next-line no-console
		console.log(`user connected: ${socket.id}`);

		socket.on(STOCK_ADD, stock => socket.broadcast.emit(STOCK_ADD, stock));
		socket.on(STOCK_REMOVE, stock => socket.broadcast.emit(STOCK_REMOVE, stock));
		// eslint-disable-next-line no-console
		socket.on("disconnect", () => console.log("user disconnected"));
	}

	io.on("connection", connectionHandler);

	// SEARCH STOCKS AND SAVE ITS DATA
	app.post("/api/addStock", async (req, res, next) => {
		const stock = mongoSanitize((req.body.stock || "").trim());
		if (!stock) { return setTimeout(() => res.status(400).send("You need to input stock code!"), 300); }

		return db.getUpdateTime()
			.then((result) => {
				if (result) {
					const now = Date.now();
					const _4hrsMilisecs = 4 * 60 * 60 * 1000; //hrs*mins*secs*milisecs
					const dataOlderThan4hrs = (now - db.updatedUTC.getTime()) > _4hrsMilisecs;

					// MERGE DB AND API DATA AND RETURN
					if (!dataOlderThan4hrs) {
						return helper.mergeAndReturnData(res, stock); // TESTING OK!!!
					}
				}
				// NO DATA IN DB || DATA OLDER THAN 17:00 LAST DAY - UPDATE, SAVE AND RETURN
				return helper.refreshAndReturnData(res, stock);
			})
			.catch(error => res.status(400).send({ error: error.message }));
	});


	app.post("/api/getAllStocks", async (req, res) => {
		try {
			const result = await db.getUpdateTime();
			if (result) {
				const now = Date.now();
				// eslint-disable-next-line no-underscore-dangle
				const _4hrsMilisecs = 4 * 60 * 60 * 1000; // hrs*mins*secs*milisecs
				const dataOlderThan4hrs = (now - result.updatedUTC.getTime()) > _4hrsMilisecs;
				// REFRESH API DATA, SAVE AND RETURN
				if (dataOlderThan4hrs) {
					return helper.refreshAndReturnData(res); // TESTING OK!!!
				}
				return helper.mergeAndReturnData(res); // TESTING OK!!!
			}
			// eslint-disable-next-line no-console
			console.log("wtf");
			return res.send("");
		}
		catch (error) {
			return res.status(400).send({ error: error.message });
		}
	});

	app.post("/api/removeStock", (req, res) => {
		const stock = mongoSanitize(req.body.stock.trim());
		if (stock === "") { return setTimeout(() => res.status(400).send("You need to input stock code!"), 300); }

		return db.removeStock(stock)
			.then(() => {
				db.getAllData()
					.then(response => res.send(response))
					.catch(error => res.status(400).send({ error: error.message }));
			})
			.catch(error => res.status(400).send({ error: error.message }));
	});


	// PUT ALL ROUTES ABOVE THIS LINE OF CODE! "*" NEEDED FOR REACT ROUTER HISTORY LIB
	app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
};
