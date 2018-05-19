"use strict";

/* eslint-disable indent */
export default function drawAxis(params) {
	if (params.initialize === true) {
		// draw gridlines
		this.append("g")
			.classed("gridline", true)
			.attr("transform", "translate(0,0)")
			.call(params.gridlines)
				.selectAll("line")
				.classed("gridlines", true);

		// draw x axis and anchors
		this.append("g")
			.classed("x axis", true)
			.attr("transform", `translate(0,${params.height})`)
			.call(params.axis.x)
				.selectAll("text")
				.classed("x-axis-label", true)
					.style("text-anchor", "middle") // "end" and dx = -8 - with rotation
					.attr("dx", 0)
					.attr("dy", 8)
					.attr("transform", "translate(0,0)"); /* rotate(-45) */

		this.append("g")
			.classed("y axis", true)
			.attr("transform", `translate(${params.width}, 0)`)
			.call(params.axis.y);

		// draw y axis caption
		this.select(".y.axis")
			.append("text")
			.classed("y-axis-caption", true)
			.text("Votes")
			.attr("x", 0)
			.attr("y", -50)
			.attr("transform", "rotate(-90)")
			.attr("fill", "#333")
			.style("text-anchor", "end");

		// draw description texts
		this.select(".x.axis")
			.append("text")
			.text(params.description.slice(0, params.description.indexOf("http") - 4))
			.attr("dx", params.width / 2)
			.attr("dy", 50)
			.style("fill", "steelblue")
			.style("font-size", "1.2rem")
			.style("text-anchor", "middle");
		this.select(".x.axis")
			.append("a")
			.classed("svglink", true)
				.attr("xlink:href", params.description.slice(params.description.indexOf("http"), -1))
				.attr("xlink:show", "new")
				.append('text')
				.text(params.description.slice(params.description.indexOf("http"), -1))
				.attr("dx", params.width / 2)
				.attr("dy", 70)
				.style("fill", "steelblue")
				.style("font-size", "0.8rem")
				.style("text-anchor", "middle");
	} else if (params.initialize === false) {
		// update gridlines
		this.selectAll("g.gridline")
			.transition()
			.duration(1500)
			.call(params.gridlines);

		// x axis and anchors
		this.selectAll("g.x.axis")
			.transition()
			.duration(1500)
			.attr("transform", `translate(0,${params.height})`)
			.call(params.axis.x)
				.selectAll(".x-axis-label")
					.style("text-anchor", "middle")
					.attr("dx", 0)
					.attr("dy", 8)
					.attr("transform", "translate(0,0)");

		this.selectAll("g.y.axis")
			.transition()
			.duration(1500)
			.call(params.axis.y);

		this.selectAll("g.tick")
		.classed("tick", true);
	}
}
/* eslint-enable */
