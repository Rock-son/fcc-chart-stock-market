"use strict";

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");/* webpack --json > stats.json */
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const isDevEnv = process.env.NODE_ENV === "development" || false;
const { Aliases } = require("./webpack.config.aliases");

// HTML_WEBPACK_PLUGIN
const TEMPLATE_IN = "./public/template.html";
const TEMPLATE_OUT = "./index.html";
// BUNDLE ENTRY & OUTPUT
const BUNDLE = path.join(__dirname, "public", "index.jsx");
const OUTPUT = path.join(__dirname, "dist");
// LIBS (files that don't change much)
const VENDOR_LIBS = ["react", "react-dom"];


const config = {
	entry: {
		bundle: BUNDLE,
		vendor: VENDOR_LIBS
	},
	output: {
		path: OUTPUT,
		filename: "[name].[hash].js"
	},
	resolve: {
		// using aliases makes components reusable! - with no relative paths, i.e. just "require("Home")"
		alias: Aliases,
		extensions: [".js", ".jsx", ".scss"]
	},
	devtool: "#source-map",
	devServer: {
		contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "public")],
		hot: true,
		quiet: true
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: "babel-loader",
				exclude: /(node_modules)/
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
						loader: "css-loader",
						options: { importLoaders: 1, sourceMap: isDevEnv }},
					{
						loader: "resolve-url-loader",
						options: { sourceMap: isDevEnv }},
					{
						loader: "postcss-loader",
						options: { sourceMap: isDevEnv }},
					{
						loader: "sass-loader",
						options: { sourceMap: isDevEnv }
					}]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: "[name].[contenthash].css"
			// disable: isDevEnv
		}),
		new FriendlyErrorsWebpackPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			names: ["vendor", "manifest"]
		}),
		new HtmlWebpackPlugin({
			template: TEMPLATE_IN,
			filename: TEMPLATE_OUT// target path
		}),
		/* new BundleAnalyzerPlugin(), - deflag for onetime statistic purposes */
		new webpack.DefinePlugin({
			"process.env": {
				"NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
			}
		})
	]
};

module.exports = config;