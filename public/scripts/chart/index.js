"use strict";

import * as d3 from "d3";

import plot from "./drawPlot";
import zoomFunction from "./helpers/zoom";
import { mouseLeave } from "./helpers/mouseEvents";

export default function (pollData, initialize = true, removeStock = null, addStock = null) {
	// container object's width and height
	const innerHeight = +window.innerHeight;
	const innerWidth = +window.innerWidth;
	const w = innerWidth > 1250 ? innerWidth * 0.75 : innerWidth * 0.95; // same as in responsive CSS
	const h = innerHeight < 400 ? innerHeight * 0.8 : innerHeight * 0.6;
	const margin = {
		top: innerHeight < 400 ? 30 : 60,
		bottom: 60,
		left: 60,
		right: 60,
		w,
		h
	};
	const width = w - margin.left - margin.right;
	const height = h - margin.top - margin.bottom;
	/*
	const poll = [{
		id: "TSLA",
		values: [
			{ date: "2017-06-09", price: 357.32 }
	},
	{
		id: "AAPL",
		values: [
			{ date: "2017-05-15", price: 153.3166 }
		]
	}];
	*/
	/* eslint-disable indent */
		const parseTime = d3.timeFormat("%d.%b");
		const data = pollData.map(stock => ({ id: stock.id, values: stock.values.map(value => ({ date: new Date(value.date), price: +value.price })) }));
		const description = "Powered by D3 and https://iextrading.com";
		let chart = null;
		const x = d3.scaleTime()
			.domain([d3.min(data, c => d3.min(c.values, d => d.date)),
						d3.max(data, c => d3.max(c.values, d => d.date))])
			.range([0, width]);
		const y = d3.scaleLinear()
						.domain([0/* d3.min(data, c => d3.min(c.values, d => +d.price)) - 100 */,
								d3.max(data, c => d3.max(c.values, d => +d.price)) + 50])
						.range([height, 0]);
		const z = d3.scaleOrdinal(d3.schemeCategory10)
						.domain(data.map(d => d.id));
		const line = d3.line()
						.x(d => x(d.date))
						.y(d => y(d.price))
						.curve(d3.curveLinear);
		const yGridLines = d3.axisLeft()
								.scale(y)
								.tickSize(-width, 0, 0)
								.tickFormat("");
		const xAxis = d3.axisBottom()
							.scale(x)
							.ticks(d3.timeDay.every(16))
							.tickFormat(parseTime);
		const yAxis = d3.axisRight()
							.scale(y)
							.tickSize(3, 0, 0)
							.ticks(d3.max(data, c => d3.max(c.values, d => d.data)));
		const zoom = d3.zoom()
						.on("zoom", zoomFunction.bind(this, x, xAxis));

	if (initialize === true) {
		const svg = d3.select("body")
						.append("svg")
						.attr("id", "chart")
						.attr("width", w)
						.attr("height", h);
		chart = svg.append("g")
						.classed("display", true)
						.attr("transform", `translate(${margin.left}, ${margin.top})`)
						.on("mouseover", mouseLeave)
						.call(zoom);
		d3.select('body')
					.append('div')
					.style("display", "none")
					.classed("tooltip", true);
		chart.append('text')
			.classed("chart-title", true)
			.html("Stocks")
			.attr("width", 200)
			.attr("height", 200)
			.attr("x", width / 2)
			.attr("y", -15)
			.attr("transform", "translate(0,0)")
			.style("text-anchor", "middle");
	} else {
		chart = d3.select("g.display");
	}

		plot.call(chart, {
			removeStock,
			addStock,
			margin,
			height,
			width,
			description,
			data,
			line,
			axis: {
				x: xAxis,
				y: yAxis
			},
			xScale: x,
			yScale: y,
			zScale: z,
			gridlines: yGridLines,
			initialize
		});
}
/* eslint-enable */
