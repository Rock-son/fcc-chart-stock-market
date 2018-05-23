"use strict";

import * as d3 from "d3";

import drawNewStocks from "./helpers/drawNewStocks";
import drawTooltipPoints from "./helpers/drawTooltipPoints";
import drawAxis from "./drawAxis";

/* eslint-disable indent */
export default function (params) {
	// draw the axes
	drawAxis.call(this, params);
	// enter
	if (params.initialize === true) {
		drawNewStocks.call(this, params);
		drawTooltipPoints.call(this, params);
	} else {
		// UPDATE STOCKS
		this.selectAll(".stock .line")
				.attr("d", function a() {
					return d3.select(this).attr('d');
				})
				.transition()
				.duration(1500)
				.attr("d", d => params.line(d.values));

		this.selectAll("g.stock")
				.selectAll(".text-caption")
				.attr("transform", function a() {
					return d3.select(this).attr('transform');
				})
				.transition()
				.duration(1500)
				.attr("transform", d => `translate(${params.xScale(d.value.date) - 60},${params.yScale(d.value.price)})`);
		// UPDATE TOOTLTIP POINTS
		d3.selectAll(`circle:not(.${params.removeStock})`)
				.attr("cx", function a() {
					return d3.select(this).attr('cx');
				})
				.attr("cy", function a() {
					return d3.select(this).attr('cy');
				})
				.transition()
				.duration(1500)
				.attr("cx", function a(d) {
					const idx = d3.select(this).attr('title') || 0;
					return params.xScale(d.values[idx].date);
				})
				.attr("cy", function a(d) {
					const idx = d3.select(this).attr('title') || 0;
					return params.yScale(d.values[idx].price);
				});

		if (params.removeStock) {
			setTimeout(() => {
				d3.selectAll(`.${params.removeStock}`).remove();
				this.select(`#${params.removeStock}`).remove();
			}, 400);
		}
		// DRAW OR UPDATE NEW STOCKS AND TOOLTIP POINTS
		setTimeout(() => {
			drawNewStocks.call(this, params);
			drawTooltipPoints.call(this, params);
		}, 400);
	}
}
/* eslint-enable */
