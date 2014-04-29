/**
 * svg element with viewBox
 */
var EasyChart = function (svg) {
	var that = this;
	this._svg = svg;
	this._series = [];
	this._viewbox = {
		min_x: 0,
		min_y: 0,
		width: 1000,
		height: 1000
	};
	this._svg.attr("viewBox",this._viewbox.min_x + " " + this._viewbox.min_y + " " + this._viewbox.width + " " + this._viewbox.height);
	this._svg.attr("preserveAspectRatio","none");
	this._svg.on("mousemove",function() {
		var pos = d3.mouse(this);
		console.log("on svg " + that._inverse_x(pos[0]) + " " +that._inverse_y(pos[1]) );
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

/**
 *
 */
// TODO OPTIMIZE
EasyChart.prototype._updateTransformations = function() {
	// calculate this._min_x & this._min_y & this._width & this._height
	var domains = this._series.filter(function(series){return series.data.length >0;}).map(function(series){
		return series.domain();
	});
	
	var min_x = d3.min(domains,function(d){
		return d.x.min;
	});
	var min_y = d3.min(domains,function(d){
		return d.y.min;
	});
	var max_x = d3.max(domains,function(d){
		return d.x.max;
	});
	var max_y = d3.max(domains,function(d){
		return d.y.max;
	});
	var range_x = max_x - min_x;
	var range_y = max_y - min_y;
	
	var a_x = 1000 / range_x;
	var b_x = -a_x * min_x;
	var a_y = -1000 / range_y;
	var b_y = -a_y * max_y;

	this._x = function(x) {
		return a_x*x + b_x;
	};
	
	this._y = function(y) {
		return a_y*y + b_y;
	};
	
	this._inverse_x = function(x) {
		return (x - b_x)/a_x;
	};
	
	this._inverse_y = function(y) {
		return (y-b_y)/a_y;
	};
};

EasyChart.prototype.update = function() {
	this._updateTransformations();
	this._series.forEach(function(series){
		series.update();
	});
};


