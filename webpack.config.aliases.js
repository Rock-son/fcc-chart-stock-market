"use strict";

const path = require("path");

module.exports.Aliases = {
	// HOME
	App: path.join(__dirname, "public/components/chart/App.jsx"),
	Chart: path.join(__dirname, "public/components/chart/Chart.jsx"),
	Footer: path.join(__dirname, "public/components/chart/Footer.jsx"),
	// MISCELLANEOUS
	StockChart: path.join(__dirname, "db/models/StockChart.js")
};
