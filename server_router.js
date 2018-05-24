"use strict";

const path = require("path");
const helper = require("./db/controllers/helpers");
const db = require("./db/controllers/controller");
const mongoSanitize = require("mongo-sanitize");
const getClientIp = require("./db/controllers/modules/getIp").default;
const { STOCK_ADD, STOCK_REMOVE, CONNECT } =
{
	STOCK_ADD: "STOCK_ADD",
	STOCK_REMOVE: "STOCK_REMOVE",
	CONNECT: "CONNECT"
};

module.exports.default = function(app, io) {

	io.on("connection", connectionHandler)

	function connectionHandler(socket) {
		console.log("user connected: " + socket.id);

		socket.on(STOCK_ADD, stock => socket.broadcast.emit(STOCK_ADD, stock));
		socket.on(STOCK_REMOVE, stock => socket.broadcast.emit(STOCK_REMOVE, stock));
		socket.on("disconnect", () => console.log("user disconnected"));
	}


	// SEARCH STOCKS AND SAVE ITS DATA
	app.post("/api/addStock", async (req, res, next) => {

		const stock = mongoSanitize((req.body.stock || "").trim());
		if (!stock) { return setTimeout(() => res.status(400).send("You need to input stock code!"), 300); }

		db.getUpdateTime()
			.then(db => {
				if (db) {
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
			.catch(error => res.status(400).send({error: error.message}))
	});


	app.post("/api/getAllStocks", (req, res, next) => {

		db.getUpdateTime()
			.then(db => {
				if (db) {
					const now = Date.now();
					const _4hrsMilisecs = 4 * 60 * 60 * 1000; //hrs*mins*secs*milisecs
					const dataOlderThan4hrs = (now - db.updatedUTC.getTime()) > _4hrsMilisecs;

					// REFRESH API DATA, SAVE AND RETURN
					if (dataOlderThan4hrs) {
						return helper.refreshAndReturnData(res); // TESTING OK!!!
					}
					return helper.mergeAndReturnData(res); // TESTING OK!!!
				}
				console.log("wtf");
				return res.send("");
			})
			.catch(error => res.status(400).send({error: error.message}))
	});

	app.post("/api/removeStock", (req, res, next) => {
		const stock = mongoSanitize(req.body.stock.trim());
		if (stock === "") { return setTimeout(() => res.status(400).send("You need to input stock code!"), 300); }

		db.removeStock(stock)
			.then(() => {
				db.getAllData()
					.then(response => res.send(response))
					.catch(error => res.status(400).send({error: error.message}));
			})
			.catch(error => res.status(400).send({error: error.message}));
		}
	);



	// PUT ALL ROUTES ABOVE THIS LINE OF CODE! "*" NEEDED FOR REACT ROUTER HISTORY LIB
	app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
}
