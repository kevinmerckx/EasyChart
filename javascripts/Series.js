var Series = function(series,chart,g) {
	this._chart = chart;
	this.data = series.data || [];
	this.legend = series.legend || "";
	this.color = series.color || "blue";
	this._g = g;
	this._g.classed({
		"series":true
	});
	this._line = d3.svg.line()
	.x(function(d){
		return chart._x(d.x)
	})
	.y(function(d){
		return chart._y(d.y);
	});
	this._path = this._g.append("path");
	this._path.classed({"curve":true}).attr("stroke",this.color);
};

// this method should cause the EasyChart to draw everything
Series.prototype.update = function() {
	if(this.data.length > 1){
		this._path.transition().attr("d",this._line(this.data)).attr("stroke",this.color);
	}		
};

Series.prototype.domain = function() {
	if(this.data.length === 0) {
		return;
	}
	return {
		x:{
			min: d3.min(this.data,function(d){
				return d.x;
			}),
			max: d3.max(this.data,function(d){
				return d.x;
			})
		},
		y:{
			min: d3.min(this.data,function(d){
				return d.y;
			}),
			max: d3.max(this.data,function(d){
				return d.y;
			})
		}
	};
};