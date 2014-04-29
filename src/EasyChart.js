/**
 * svg element with viewBox
 */
var EasyChart = function (svg) {
	this._svg = svg;
	this._series = [];
	this._min_x = 0;
	this._min_y = 0;
	this._max_x = 999;
	this._max_y = 999;
	this._width = 1000;
	this._height = 1000;
	this._svg.attr("preserveAspectRatio","none");
	this._svg.on("mousemove",function() {
		console.log("on svg " + d3.mouse(this));
	});
};

// series.data = [{x:,y:}]
	// series.legend = "My legend"
	// series.color = "green"
	// returns a Series object:
	// - update 
EasyChart.prototype.addSeries = function(series) {
	var seriesObj = new Series(series,this,this._svg.append("g"));
	this._series.push(seriesObj);
	this.update();
	return seriesObj;
};

EasyChart.prototype._updateViewbox = function() {
	// calculate this._min_x & this._min_y & this._width & this._height
	var mins_x = [];
	var maxs_x = [];
	var mins_y = [];
	var maxs_y = [];
	this._series.forEach(function(series){
		if(series.data.length === 0) {
			return;
		}
		var x = series.data.map(function(pt){return pt.x;});
		var y = series.data.map(function(pt){return pt.y;});
		mins_x.push(Math.min.apply(null,x));
		maxs_x.push(Math.max.apply(null,x));
		mins_y.push(Math.min.apply(null,y));
		maxs_y.push(Math.max.apply(null,y));
	});
	if(mins_x.length === 0) {
		return;
	}
	this._min_x = Math.min.apply(null,mins_x);
	this._min_y = Math.min.apply(null,mins_y);
	this._max_x = Math.max.apply(null,maxs_x);
	this._max_y = Math.max.apply(null,maxs_y);
	this._width = this._max_x - this._min_x;
	this._height = this._max_y - this._min_y;
};

EasyChart.prototype.update = function() {
	var that = this;
	this._updateViewbox();
	this._svg.transition().duration(1000).attr("viewBox",this._min_x + " " + this._min_y + " " + this._width + " " + this._height).each(function(){
		that._fontSize = Math.max(that._width,that._height)/500;
		that._series.forEach(function(series){ series.update(); });
	});
};

EasyChart.prototype._x = function(x) {
	return x;
};

EasyChart.prototype._y = function(y) {
	return - y  + this._max_y + this._min_y;
};

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
	this._path.transition(1000).attr("d",this._line(this.data)).attr("stroke",this.color);
};
