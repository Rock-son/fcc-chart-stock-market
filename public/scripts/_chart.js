"use strict";

import * as d3 from "d3";


export default (data) => {
	// container object's width and height
	const winSize = +window.innerWidth;
	const w = +window.innerWidth > 660 ? winSize * 0.7 : winSize; // same as in responsive CSS
	const h = +window.innerHeight / 1.2;
	const margin = {
		top: 100,
		bottom: 120,
		left: winSize < 999 ? 40 : 80,
		right: 20
	};
	const width = w - margin.left - margin.right;
	const height = h - margin.top - margin.bottom;


	const poll = data;
	const data = poll.options.map(item => ({ key: item[0], value: item[1] }));
	const max = d3.max(data, entry => entry.value);

	const x = d3.scale.ordinal()
		.domain(data.map(entry => entry.key))
		.rangeBands([0, width]);
	const y = d3.scale.linear()
		.domain([0, d3.max(data, d => d.value)])
		.range([height, 0]);

	const yGridLines = d3.svg.axis()
		.scale(y)
		.tickSize(-width, 0, 0)
		.tickFormat("")
		.orient("left")
		.ticks(max);
	const linearColorScale = d3.scale.linear()
		.domain([0, data.length])
		.range(["#572500", "#F68026"]);
	const ordinalColorScale = d3.scale.category20();

	const xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickSize(0);
	const yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(max);

	const svg = d3.select("#graph").append("svg")
		.attr("id", "chart")
		.attr("width", w)
		.attr("height", h);

	const chart = svg.append("g")
		.classed("display", true)
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

	const controls = d3.select(".container__right")
		.append("div")
		.attr("id", "controls");

	const sort_btn = controls.append("button")
		.html("Sort data: ascending")
		.attr("state", 0);
};
