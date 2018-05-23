"use strict";

import * as d3 from "d3";
import { mouseMove, mouseEnter, tooltipPointsUpdate, tooltipUpdate } from "./mouseEvents";
import zoomFunction from "./zoom";

export default function (params) {
	const tooltipData = params.data.reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur.values, dates: cur.values.map(item => item.date) }), {});
	// APPEND ZOOM AREA
	const svg = d3.select("#chart");
	let idx = null;
	if (params.initialize) {
		svg.append("rect")
			.classed("zoom", true)
			.attr("transform", `translate(${params.margin.left}, ${params.margin.top})`)
			.attr("width", params.width)
			.attr("height", params.height)
			.call(d3.zoom().on("zoom", zoomFunction.bind(this, params.xScale, params.axis.x)))
			.on("mouseover", mouseEnter)
			.on("mousemove", mouseMove.bind(this, tooltipData, params));
		// TOOLTIP LINE
		svg.append("path")
			.attr("visibility", "visible")
			.attr("class", "tooltipLine")
			.attr("d", `M ${params.width} 0 L ${params.width} ${params.height}`)
			.attr("transform", `translate(${params.margin.left}, ${params.margin.top})`);
		// TOOLTIP POINTS SHADOW
		svg.append("g")
			.classed("shadows", true)
			.selectAll("circle")
			.data(params.data)
			.enter()
			.append("circle")
			.attr("class", d => `point-shadows ${d.id}`);
		svg.selectAll(".point-shadows")
			.attr("r", "8")
			.attr("visibility", "hidden")
			.style("fill", d => params.zScale(d.id))
			.attr("transform", `translate(${params.margin.left}, ${params.margin.top})`);
		// TOOLTIP BASE POINTS
		svg.append("g")
			.classed("points", true)
			.selectAll("circle")
			.data(params.data)
			.enter()
			.append("circle")
			.attr("class", d => `cross-points ${d.id}`);
		svg.selectAll(".cross-points")
			.attr("r", "2.5")
			.attr("visibility", "hidden")
			.style("fill", d => params.zScale(d.id))
			.attr("transform", `translate(${params.margin.left}, ${params.margin.top})`);
	} else {
		svg.select(".zoom")
			.call(d3.zoom().on("zoom", zoomFunction.bind(this, params.xScale, params.axis.x)))
			.on("mouseover", mouseEnter)
			.on("mousemove", mouseMove.bind(this, tooltipData, params));
		if (params.addStock) {
			svg.select(".points")
				.append("circle")
				.attr("class", () => `cross-points ${params.addStock}`)
				.attr("visibility", () => d3.select(".point-shadows").style("visibility"));
			svg.select(".shadows")
				.append("circle")
				.attr("class", () => `point-shadows ${params.addStock}`)
				.attr("visibility", () => d3.select(".point-shadows").style("visibility"));
		}
		// TOOLTIP POINTS SHADOW
		svg.selectAll(".point-shadows")
			.data(params.data)
			.enter()
			.attr("class", d => `point-shadows ${d.id}`);
		svg.selectAll(".point-shadows")
			.attr("r", "8")
			.attr("visibility", function a() {
				idx = idx || d3.select(this).attr("title");
				return d3.select(this).attr("visibility");
			})
			.style("fill", d => params.zScale(d.id))
			.attr("transform", `translate(${params.margin.left}, ${params.margin.top})`);
		// TOOLTIP BASE POINTS
		svg.selectAll(".cross-points")
			.data(params.data)
			.enter()
			.attr("class", d => `cross-points ${d.id}`);
		svg.selectAll(".cross-points")
			.attr("r", "2.5")
			.attr("visibility", function a() {
				return d3.select(this).attr("visibility");
			})
			.style("fill", d => params.zScale(d.id))
			.attr("transform", `translate(${params.margin.left}, ${params.margin.top})`);

		if (idx) {
			d3.selectAll("circle").call(tooltipPointsUpdate, idx, params);
			d3.select(".tooltip").call(tooltipUpdate, idx, tooltipData, params);
		}
	}
}
