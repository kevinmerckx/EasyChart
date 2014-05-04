var ChartView = function(svg) {
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
	
	this.xScale = d3.scale.linear();
};

ChartView.prototype.addSeries = function(series) {
	var that = this;
	if(!this._lineSeries) {
		this._lineSeries =  d3.svg.line()
		.x(function(d){
			return that._x(d.x)
		})
		.y(function(d){
			return that._y(d.y);
		});
	}
	var g = this._svg.append("g").classed({
		"series":true
	});
	var path = g.append("path").classed({"curve":true});
	this._series.push({
		series: series,
		g: g,
		path: path
	});
	return this;
};

ChartView.prototype._updateTransformations = function() {
	
	var domain = this.xScale.domain();
	var range = this.xScale.range();
	
	var min_x = domain[0];
	var max_x = domain[1];
	
	var min_y = range[0];
	var max_y = range[1];
	
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

ChartView.prototype._updateDomainAndRange = function() {
	var domains = this._series.filter(function(series){
		return series.series.data.length >0;
	}).map(function(series){
		return series.series.domain();
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

	this.xScale
	.domain([min_x,max_x])
	.nice()
	.range([min_y,max_y]);
};

ChartView.prototype.update = function() {
	var that = this;
	this._updateDomainAndRange();
	this._updateTransformations();
	this._series.forEach(function(series){
		series.path.transition().attr("d",that._lineSeries(series.series.data)).attr("stroke",series.series.color);
	});
		
	return this;
};

ChartView.prototype.hideXVericalLine = function(x) {
	this._verticalLine.classed({"visible":false});
	return this;
};

ChartView.prototype.showXVericalLine = function(x) {
	this.moveXVericalLine(x);
	this._verticalLine.classed({"visible":true});
	return this;
};

ChartView.prototype.moveXVericalLine = function(x) {
	x = this._x(x);
	var line = d3.svg.line().x(function(d){return d.x}).y(function(d){return d.y});
	this._verticalLine.attr("d",line([{x:x,y:this._domainViewBox.y.min},{x:x,y:this._domainViewBox.y.max}]));
	return this;
};

/** 
 * From pixels to percentage %
 */
ChartView.prototype.fromPixelsToRelativePosition = function(pos) {
	var rect = this._svg[0][0].getBoundingClientRect();
	var a_x = 100.0/(rect.width-1);
	var a_y = 100.0/(rect.height-1);
	return {
		x: a_x * pos.x,
		y: a_y * pos.y
	};
};

ChartView.prototype.fromRelativePositionToPixels = function(pos) {
	var rect = this._svg[0][0].getBoundingClientRect();
	// first convert into viewbox pixels
	var a_x = (rect.width-1)/100.0;
	var a_y = (rect.height-1)/100.0;
	return {
		x: a_x*pos.x,
		y: a_y*pos.y
	};
};

/** 
 * % in viewbox to values
 */
ChartView.prototype.fromRelativePositionToValues = function(pos) {
	pos.x = pos.x * this._domainViewBox.x.max / 100.0;
	pos.y = pos.y * this._domainViewBox.y.max / 100.0;
	return {
		x: this._inverse_x(pos.x),
		y: this._inverse_y(pos.y)
	};
};

/** From values to % in viewbox */
ChartView.prototype.fromValuesToRelativePosition = function(pos) {
	return {
		x: this._x(pos.x) * 100.0 /this._domainViewBox.x.max,
		y: this._y(pos.y) * 100.0 /this._domainViewBox.y.max
	};
};
