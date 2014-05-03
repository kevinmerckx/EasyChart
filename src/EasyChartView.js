var EasyChartView = function(svg) {
	this._svg = svg;
	this._series = [];

	this._domainViewBox = {
		x: {
			min: 0,
			max: 999
		},
		y: {
			min: 0,
			max: 999
		}
	};
	this._viewbox = {
		min_x: 0,
		min_y: 0,
		width: 1000,
		height: 1000
	};
	
	this._svg.classed({"chart":true})
	.attr("viewBox",this._viewbox.min_x + " " + this._viewbox.min_y + " " + this._viewbox.width + " " + this._viewbox.height)
	.attr("preserveAspectRatio","none");
	
	this._verticalLine = this._svg.append("path").classed({"vertical-line-marker":true});
};

EasyChartView.prototype.addSeries = function(series) {
	var seriesObj = new Series(series,this,this._svg.append("g"));
	this._series.push(seriesObj);
	return seriesObj;
};

EasyChartView.prototype._updateTransformations = function() {
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
	
	var a_x = (this._domainViewBox.x.max - this._domainViewBox.x.min) / range_x;
	var b_x = this._domainViewBox.x.min -a_x * min_x;
	var a_y = -(this._domainViewBox.y.max - this._domainViewBox.y.min) / range_y;
	var b_y = this._domainViewBox.y.max - a_y * min_y;

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

EasyChartView.prototype.update = function() {
	this._updateTransformations();
	this._series.forEach(function(series){
		series.update();
	});
};

EasyChartView.prototype.showXVericalLine = function(x) {
	x = this._x(x);
	var line = d3.svg.line().x(function(d){return d.x}).y(function(d){return d.y});
	this._verticalLine.attr("d",line([{x:x,y:this._domainViewBox.y.min},{x:x,y:this._domainViewBox.y.max}]));
};

EasyChartView.prototype.fromPixelsToValues = function(x,y) {
	var rect = this._svg[0][0].getBoundingClientRect();
	// first convert into viewbox pixels
	var a_x = (this._domainViewBox.x.max - this._domainViewBox.x.min)/(rect.width-1);
	var a_y = (this._domainViewBox.y.max - this._domainViewBox.y.min)/(rect.height-1);
	x = a_x * x + this._domainViewBox.x.min;
	y = a_y * y + this._domainViewBox.y.min;
	//
	return {
		x: this._inverse_x(x),
		y: this._inverse_y(y)
	};
};

EasyChartView.prototype.pixelFromPoint = function(x,y) {
	
};

$.observable(EasyChartView);
