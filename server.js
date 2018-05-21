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
const helper = require("./db/controllers/helpers");
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
// LOG (Helmet-csp) CSP blocked requests
// app.post("/report-violation", Log.logged);

// SECURITY
helmet(app);

//LIMITER
app.use(limiter);


// DB
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl, { useMongoClient: true, autoIndex: false });



// SEARCH STOCKS AND SAVE ITS DATA
app.post("/api/addStock", async (req, res, next) => {

	const stock = mongoSanitize((req.body.stock || "").trim());
	if (!stock) { return setTimeout(() => res.status(400).send("You need to input stock code!"), 300); }

	db.getUpdateTime()
		.then(db => {
			if (db) {
				const now = Date.now();
				const _7hrsMilisecs = 7 * 60 * 60 * 1000; //hrs*mins*secs*milisecs
				const dataOlderThan7hrs = (now - db.updatedUTC.getTime()) > _7hrsMilisecs;

				// MERGE DB AND API DATA AND RETURN
				if (!dataOlderThan7hrs) {
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
				const _7hrsMilisecs = 7 * 60 * 60 * 1000; //hrs*mins*secs*milisecs
				const dataOlderThan7hrs = (now - db.updatedUTC.getTime()) > _7hrsMilisecs;

				// REFRESH API DATA, SAVE AND RETURN
				if (dataOlderThan7hrs) {
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




// SERVER
http.createServer(app)
	.listen(port, () => console.log("Listening on port: " + port));
