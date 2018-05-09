"use strict";

const helmet = require("helmet");
const helmetCsp = require("helmet-csp");

module.exports = function a(app) {


	// SECURITY middleware (Helmet, Helmet-csp)
	app.use(helmet({ dnsPrefetchControl: { allow: true } }));
	app.use(helmet.hidePoweredBy());
	app.use(helmetCsp({
		directives: {
			defaultSrc: ["'self'", "https://fcc-nightlife-coordination-app.herokuapp.com/*"],
			scriptSrc:	["'self'", "https://cdnjs.cloudflare.com"],
			styleSrc:	["'self'", "https://cdnjs.cloudflare.com"],
			fontSrc:	["'self'", "https://cdnjs.cloudflare.com"],
			connectSrc: ["'self'", "https://api.foursquare.com/*"],
			imgSrc:		["'self'", "data:", "https://api.foursquare.com/*", "https://igx.4sqi.net/*"],
			sandbox:	["allow-forms", "allow-scripts", "allow-same-origin"]
			// reportUri: '/report-violation' // set up a POST route for notifying / logging data to server
		},
		reportOnly: (req) => {
			if (req.query.cspmode === "debug") {
				return true;
			}
			return false;
		}
	}));

	app.use((req, res, next) => {
		res.set({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Origin, X-Requested-With, content-type, Accept, Authorization",
			"Vary": "Origin"
		});
		app.disable("x-powered-by");
		next();
	});
};
