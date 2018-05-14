"use strict";
// if development
if (process.env.HEROKU_RUN == null) {
      require("dotenv").config();
}

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
// ROUTES
const axios = require("axios");
const axiosJS = require("./db/controllers/modules/axios");
const getClientIp = require("./db/controllers/modules/getIp").default;
// SECURITY
const helmet = require("./security/helmet");
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie-encrypter");
const mongoSanitize = require("mongo-sanitize");
// LOGGING:  morgan = require("morgan"),  Log = require("./logs/services/morganLog"), accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", "access.log"), {flags: "a"}), // writable stream - for MORGAN logging
// DB
const mongoose = require("mongoose");
const dbUrl = process.env.DBLINK;
const db = require("./db/controllers/controller");
// PORT & ROUTER
const port = process.env.PORT || 8080;
const app = express();
// LIMITER
const RateLimiter = require("express-rate-limit");
const limiter = new RateLimiter({
		windowMs: 15*60*1000, // 15 minutes
		max: 200, // limit each IP to 200 requests per windowMs (fonts, jpeg, css)
		delayMs: 0 // disable delaying - full speed until the max limit is reached
	}
);

// COOKIES
app.use(cookieParser(process.env.CRYPTO_KEY));
app.use(cookieEncrypter(process.env.CRYPTO_KEY));
// ROUTES
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));
// BODY PARSERS
app.use(bodyParser.json({type: "application/json"}));
app.use(bodyParser.json({ type: ["json", "application/csp-report"] }));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(morgan({stream: accessLogStream}));

// SECURITY
helmet(app);

//LIMITER
app.use(limiter);


// DB
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, { useMongoClient: true, autoIndex: false });

// LOG (Helmet-csp) CSP blocked requests
// app.post("/report-violation", Log.logged);

// SEARCH BARS AND SAVE LAST LOCATION
app.post("/api/addStock", (req, res, next) => {
	const stock = mongoSanitize(req.body.stock.trim());
	const duration = mongoSanitize(req.body.duration.trim());
	if (stock === "" || duration === "") { return setTimeout(() => res.status(400).send("You need to input stock code!"), 300); }

	const addStockPromise = db.addStock(req, res, next, stock);
	const iextradingPromise = axios({
		method: "get",
		url: `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,chart&range=${duration}`,
		timeout: 2000,
		validateStatus: status => status < 500 // Reject if the status code < 500
		});

	Promise.all([addStockPromise, iextradingPromise]).then(response => {
		if (response[1].data === "Unknown symbol") {
			db.removeStock(req, res, next, stock)
				.then(() => res.status(400).send("Unknown symbol"))
				.catch(error => res.status(404).send({error: error.message}));
		} else {
			return res.status(200).send({dberror: response[0], chartData: response[1].data});
		}
		})
		.catch(error => {
			if (error.response) {
				// The request was made and the server responded with a status code that falls out of the range of 2xx
				return res.status(error.response.status).send(error.response.data);
			}
			if (error.request) {
				// The request was made but no response was received `error.request` is an instance of http.ClientRequest in node.js
				return res.status(400).send(error.request);
			}
			return res.status(400).send(error.message);
		});
	}
);

app.post("/api/getAllStocks", (req, res, next) => {
	let stocks = null;
	let promises = null;

	db.getAllStocks()
		.then(response => {
			if (!response.length) { res.send(""); }
			stocks = response.map(item => item.code);
			promises = stocks.map(stock => axiosJS.get(stock, "1m"));

			Promise.all(promises)
				.then(resp => res.send(resp.map(item => item.data)))
				.catch(err => res.status(400).send({error: err.message}));

		})
		.catch(err => res.status(400).send({error: err.message}));
});

app.post("/api/removeStock", (req, res, next) => {
	const stock = mongoSanitize(req.body.stock.trim());
	if (stock === "") { return setTimeout(() => res.status(400).send("You need to input stock code!"), 300); }

	db.removeStock(req, res, next, stock)
		.then(() => res.status(200).send())
		.catch(error => res.status(400).send({error: err.message}));
	}
);



// PUT ALL ROUTES ABOVE THIS LINE OF CODE!
// "*" NEEDED FOR REACT ROUTER HISTORY LIB
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));




// SERVER
http.createServer(app)
	.listen(port, () => console.log("Listening on port: " + port));
