"use strict";

import * as d3 from "d3";

let spread = null;

export function mouseMove(data, params) {
	const height = d3.select(".zoom").attr("height");
	const width = d3.select(".zoom").attr("width");

	const transform = d3.select(".zoom").attr("transform");
	const offsetX = +/.*\((\d+),.*/.exec(transform)[1] || 0;

	spread = spread || width / data.dates.length;
	const idx = Math.round((d3.event.offsetX - offsetX) / spread) - 1;
	const timeFormat = d3.timeFormat("%b %e %Y, %A");

/* eslint-disable indent */
	d3.select(".tooltip")
		.html(`<div class="tooltip__header">${timeFormat(data.dates[idx])}</div>
				<ul class="tooltip__list">
				${params.data
				.sort((a, b) => b.values[idx].price - a.values[idx].price)
				.map(item => `  <li class="tooltip__list__item" style="color:${params.zScale(item.id)}" >
									<span class="heavy">${item.id}: &nbsp</span><span class="normal">${item.values[idx].price.toFixed(2)}</span>
								</li>`)
				.join("")}
				</ul>
			`)
		.style("opacity", "1")
		.style("top", `${d3.event.pageY - 50}px`)
		.style("left", `${d3.event.pageX - 190}px`)
		.transition()
		.duration(250);

	d3.select(".tooltipLine")
		.attr("visibility", "visible")
		.attr("d", `M ${params.xScale(data.dates[idx])} ${0} L ${params.xScale(data.dates[idx])} ${height} `);

	d3.selectAll("circle")
		.attr("title", idx)
		.attr("cx", d => params.xScale(d.values[idx].date))
		.attr("cy", d => params.yScale(d.values[idx].price));
}
export function mouseEnter() {
	d3.select(".tooltip")
		.style("display", "block");
	d3.select(".tooltipLine")
		.attr("visibility", "visible");
	d3.selectAll("circle")
		.attr("visibility", "visible");
}

export function mouseLeave() {
	d3.select(".tooltip")
		.style("display", "none");
	d3.select(".tooltipLine")
		.attr("visibility", "hidden");
	d3.selectAll("circle")
		.attr("visibility", "hidden");
}

/* eslint-disable prefer-arrow-callback, indent */
export function tooltipPointsUpdate(selection, idx, params) {
	selection
		.attr("title", idx)
		.attr("cx", function a(d) { return params.xScale(d.values[idx].date); })
		.attr("cy", function a(d) { return params.yScale(d.values[idx].price); });
}

export function tooltipUpdate(selection, idx, data, params) {
	const timeFormat = d3.timeFormat("%b %e %Y, %A");

	selection
		.html(`<div class="tooltip__header">${timeFormat(data.dates[idx])}</div>
			<ul class="tooltip__list">
			${params.data
			.sort((a, b) => b.values[idx].price - a.values[idx].price)
			.map(item => `  <li class="tooltip__list__item" style="color:${params.zScale(item.id)}" >
									<span class="heavy">${item.id}: &nbsp</span><span class="normal">${item.values[idx].price.toFixed(2)}</span>
								</li>`)
			.join("")}
				</ul>
		`);
/* eslint-enable */
}
