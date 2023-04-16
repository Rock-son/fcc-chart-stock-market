"use strict";

// if development
if (process.env.HEROKU_RUN == null) {
	// eslint-disable-next-line global-require
	require("dotenv").config();
}

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// ROUTES
const serverRouter = require("./server_router").default;
// SECURITY
const helmet = require("./security/helmet");
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie-encrypter");
// LOGGING:  morgan = require("morgan"),  Log = require("./logs/services/morganLog"), accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", "access.log"), {flags: "a"}), // writable stream - for MORGAN logging
// LIMITER
const RateLimiter = require("express-rate-limit");

const limiter = new RateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200, // limit each IP to 200 requests per windowMs (fonts, jpeg, css)
	delayMs: 0 // disable delaying - full speed until the max limit is reached
});
// DB
const mongoose = require("mongoose");

const dbUrl = process.env.DBLINK;
// PORT & ROUTER
const port = process.env.PORT || 8080;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);


// COOKIES
app.use(cookieParser(process.env.CRYPTO_KEY));
app.use(cookieEncrypter(process.env.CRYPTO_KEY));
// ROUTES
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));
// BODY PARSERS
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.json({ type: ["json", "application/csp-report"] }));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(morgan({stream: accessLogStream}));
// LOG (Helmet-csp) CSP blocked requests
// app.post("/report-violation", Log.logged);

// SECURITY
helmet(app);

// LIMITER
app.use(limiter);


// DB
mongoose.Promise = global.Promise;
try {	
	mongoose.connect(dbUrl, { useMongoClient: true, autoIndex: false });
} catch (error) {
	console.log(error);
}

// ROUTES
serverRouter(app, io);

// SERVER
// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Listening on port: ${port}`));
