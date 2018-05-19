"use strict";


export default function drawNewStocks(params) {
	const stock = this.selectAll(".stock")
		.data(params.data)
		.enter()
		.append("g")
		.attr("class", d => `stock ${d.id}`);

	stock.append("path")
		.attr("class", d => `line`)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", d => params.line(d.values))
		.style("stroke", d => params.zScale(d.id));

	stock.append("text")
		.datum(d => ({ id: d.id, value: d.values[0/* d.values.length - 1 */] }))
		.attr("transform", d => `translate(${params.xScale(d.value.date) - 60},${params.yScale(d.value.price)})`)
		.attr("class", d => `text-caption`)
		.attr("fill", d => params.zScale(d.id))
		.attr("x", 3)
		.attr("dy", "0.35em")
		.style("font", ".8rem sans-serif")
		.text(d => d.id);

	// exit()
	this.selectAll(".stock")
		.data(params.data)
		.exit()
		.remove();

	this.selectAll(".stock .line")
		.data(params.data)
		.exit()
		.remove();
}
