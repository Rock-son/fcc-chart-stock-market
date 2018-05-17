"use strict";

import drawAxis from "./drawAxis";

export default function (params) {
	// draw the axes
	drawAxis.call(this, params);

	/* eslint-disable indent */ // enter
	const stock = this.selectAll(".stock")
		.data(params.data)
		.enter()
			.append("g")
			.attr("class", "stock");
	/* eslint-enable */

	// update
	stock.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", d => params.line(d.values))
		.style("stroke", d => params.zScale(d.id));


	stock.append("text")
		.datum(d => ({ id: d.id, value: d.values[d.values.length - 1] }))
		.attr("transform", d => `translate(${params.xScale(d.value.date) + 5},${params.yScale(d.value.price)})`)
		.attr("class", "text-caption")
		.attr("fill", d => params.zScale(d.id))
		.attr("x", 3)
		.attr("dy", "0.35em")
		.style("font", "10px sans-serif")
		.text(d => d.id);
	/*
	// update
		this.selectAll(".bar-label")
				.data(params.data)
				.enter()
					.append("text")
					.classed("bar-label", true);
	// remove
	this.selectAll(".bar-label")
		.data(params.data)
		.exit()
		.remove();
*/
	// exit()
	this.selectAll(".stock")
		.data(params.data)
		.exit()
		.remove();
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
