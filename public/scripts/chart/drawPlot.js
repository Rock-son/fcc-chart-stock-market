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
					const idx = d3.select(this).attr('title');
					return params.xScale(d.values[idx].date);
				})
				.attr("cy", function a(d) {
					const idx = d3.select(this).attr('title');
					return params.yScale(d.values[idx].price);
				});

		if (params.removeStock) {
			setTimeout(() => {
				d3.selectAll(`.${params.removeStock}`).remove();
				this.select(`#${params.removeStock}`).remove();
			}, 400);
		}
		setTimeout(() => {
			drawNewStocks.call(this, params);
			drawTooltipPoints.call(this, params);
		}, 400);
	}
}


/*
  function handleMouseOver(d, i) {

	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	d3.select(this).attr("fill", "orange");
	tooltip.html('<span style="font-size: 1rem; font-weight: 700;">' + d[1].toLocaleString({useGrouping: true, maximumFractionDigits: 4}) +
				 "$ Billion</span>" + '<br><span">' + new Date(d[0]).getFullYear() + ' - ' + months[new Date(d[0]).getMonth()] +'</span>')
		   .transition()
		   .duration(0)
		   .style("left", (d3.event.pageX + 15) + "px")
		   .style("top", (d3.event.pageY - 50) + "px")
		   .style("opacity", .7);
  }
  function handleMouseOut(d, i) {

	d3.select(this).attr(
			  "fill", "steelblue"
			);
	tooltip.transition()
		   .duration(300)
		   .style("opacity", 0)
		   .style("top", 0)
		   .style("left", 0);
  }
*/

/* eslint-enable */
