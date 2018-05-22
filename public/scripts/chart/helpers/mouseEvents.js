"use strict";

import * as d3 from "d3";

let spread = null;

export function mouseMove(data, xScale, yScale) {
	const height = d3.select(".zoom").attr("height");
	const width = d3.select(".zoom").attr("width");

	const transform = d3.select(".zoom").attr("transform");
	const offsetX = +/.*\((\d+),.*/.exec(transform)[1] || 0;

	spread = spread || width / data.dates.length;
	const idx = Math.round((d3.event.offsetX - offsetX) / spread) - 1;


	d3.select(".tooltip")
		.html(() => `test, ${d3.event.pageY}, ${d3.event.pageX}`)
		.style("opacity", "1")
		.style("top", `${d3.event.pageY - 50}px`)
		.style("left", `${d3.event.pageX + 15}px`);

	d3.select(".tooltipLine")
		.attr("visibility", "visible")
		.attr("d", `M ${xScale(data.dates[idx])} ${0} L ${xScale(data.dates[idx])} ${height} `);

	d3.selectAll("circle")
		.attr("title", idx)
		.attr("cx", d => xScale(d.values[idx].date))
		.attr("cy", d => yScale(d.values[idx].price));
}
/* eslint-disable prefer-arrow-callback */
export function mouseClick(selection, idx, data, xScale, yScale) {
	selection
		.attr("title", idx)
		.attr("cx", function a(d) { return xScale(d.values[idx].date); })
		.attr("cy", function a(d) { return yScale(d.values[idx].price); });
}
/* eslint-enable */
export function mouseEnter() {
	d3.select(".tooltip")
		.attr("visibility", "visible");
	d3.select(".tooltipLine")
		.attr("visibility", "visible");
	d3.selectAll("circle")
		.attr("visibility", "visible");
}

export function mouseLeave() {
	d3.select(".tooltip")
		.attr("visibility", "hidden");
	d3.select(".tooltipLine")
		.attr("visibility", "hidden");
	d3.selectAll("circle")
		.attr("visibility", "hidden");
}
