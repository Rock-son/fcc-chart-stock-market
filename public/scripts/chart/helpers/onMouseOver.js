"use strict";

import * as d3 from "d3";


export default (data, xScale) => {
	const height = d3.select(".zoom").attr("height");
	const width = d3.select(".zoom").attr("width");
	const transform = d3.select(".zoom").attr("transform");
	const offsetY = +height + +transform.split(",").slice(-1)[0].replace(")", "");

	console.log(height, width, offsetY);
	d3.select(".tooltip")
		.html(() => {return `test, ${d3.event.pageY}, ${d3.event.pageX}`; })
		.style("opacity", "1")
		.style("top", `${d3.event.pageY - 50}px`)
		.style("left", `${d3.event.pageX + 15}px`);

	d3.select(".tooltipLine")
		.attr("visibility", "visible")
		.attr("d", `M ${d3.event.offsetX} ${offsetY - height} L ${d3.event.offsetX} ${offsetY} `);
};
