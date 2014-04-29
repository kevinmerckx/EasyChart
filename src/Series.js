var Series = function(series,chart,g) {
	this.chart = chart;
	this.data = series.data || [];
	this.legend = series.legend || "";
	this.color = series.color || "blue";
	this.g = g;
	this.g.classed({
		"series":true
	});
	this.line = d3.svg.line()
	.x(function(d){
		return chart.x(d.x)
	})
	.y(function(d){
		return chart.y(d.y);
	});
	this.path = this.g.append("path");
	this.path.classed({"curve":true}).attr("stroke",this.color);
};

// this method should cause the SimpleChart to draw everything
Series.prototype.update = function() {
	this.path.transition(1000).attr("d",this.line(this.data)).attr("stroke",this.color).attr("stroke-width",this.chart.strokeWidth);
};