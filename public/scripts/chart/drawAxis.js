"use strict";


export default function drawAxis(params) {

	// draw gridlines
	this.append("g")
		.classed("gridline", true)
		.attr("transform", "translate(0,0)")
		.call(params.gridlines);

	// draw axis
	this.append("g")
		.classed("x axis", true)
		.attr("transform", `translate(0,${params.height})`)
		.call(params.axis.x)
		.selectAll("text")
		.classed("x-axis-label", true)
		.style("text-anchor", "middle") // "end" and dx = -8 - with rotation
		.attr("dx", (params.width / params.data[0].values.length) / 2)
		.attr("dy", 8)
		.attr("transform", "translate(0,0)"); /* rotate(-45) */
	this.append("g")
		.classed("y axis", true)
		.attr("transform", "translate(0,0)")
		.call(params.axis.y);

	// draw axis anchors
	this.select(".y.axis")
		.append("text")
		.classed("y-axis-label", true)
		.text("Votes")
		.attr("x", 0)
		.attr("y", 15)
		.attr("transform", "rotate(-90)")
		.attr("fill", "#333")
		.style("text-anchor", "end");
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
}
