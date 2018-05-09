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
app.post("/api/getStock", (req, res, next) => {
	if (req.body.location.trim() === "") return setTimeout(() => res.status(400).send("You need to input location!"), 300);

	passport.authenticate('jwt', {session: false}, function(err, user, info, status) {
		if (err) { return next(err) }
		if (user) {
			db.saveLastLocation(req, res, next, info, user);
		}
	})(req, res, next);
	const city = mongoSanitize(req.body.location.trim());
	const cityPromise = db.getCityBarUsers(city);
	const foursquarePromise = axios({
		method: "get",
		url: "https://api.foursquare.com/v2/venues/explore",
		timeout: 2000,
		params: {
			client_id: process.env.FSQ_CLIENT_ID,
			client_secret: process.env.FSQ_SECRET,
			near: city,
			section: "drinks",
			venuePhotos: 1,
			v: fsq_version,
			limit: 50
		},
		validateStatus: status => status < 500 // Reject if the status code < 500
		});

	Promise.all([cityPromise, foursquarePromise]).then(response => {
		return res.status(200).send({bars: response[0] || [], businesses: response[1].data.response.groups[0].items});
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




// PUT ALL ROUTES ABOVE THIS LINE OF CODE! - NOT IN USE
if (process.env.NODE_ENV !== "production") {

	const webpackDevMiddleware = require("webpack-dev-middleware");
	const webpackHotMiddleware = require('webpack-hot-middleware');
	const webpack = require("webpack");
	const webpackConfig  = require("./webpack.config.dev.js");

	const compiler = webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.path,
		stats: {colors: true}
		})
	);
	app.use(webpackHotMiddleware(compiler, {
    	log: console.log
		})
	);
} else {
	// NEEDED FOR REACT ROUTER HISTORY LIB
	app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
}



// SERVER
http.createServer(app)
	.listen(port, () => console.log("Listening on port: " + port));
