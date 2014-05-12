var ChartView = function(root) {
	var that = this;
	
	this._root = root; 
	this._svg = this._root.append("svg").attr("version","1.1").attr("xmlns","http://www.w3.org/2000/svg");//.attr("xmlns:svg","http://www.w3.org/2000/svg");
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
	.attr({
		viewBox: this._viewbox.min_x + " " + this._viewbox.min_y + " " + this._viewbox.width + " " + this._viewbox.height,
		preserveAspectRatio: "none"
	});
		
	this.xScale = d3.scale.linear();
	this.yScale = d3.scale.linear();
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
	
	
	var pathInner = g.append("path").classed({"inner-curve":true});
	
	var pathOuter = g.append("path").classed({"outer-curve":true});
	pathOuter.on("mouseover",function(){
		try {
			series.fireEvent("mouseover");
		} catch(e) {
		}
	})
	.on("mouseout",function() {
		try {
			series.fireEvent("mouseout");
		} catch(e) {
		}
	});
	
	this._series.push({
		series: series,
		g: g,
		pathInner: pathInner,
		pathOuter: pathOuter
	});
	return this;
};

ChartView.prototype._updateTransformations = function() {
	
	var domain = this.xScale.domain();
	var range = this.yScale.domain();
	
	var min_x = domain[0];
	var max_x = domain[domain.length - 1];
	
	var min_y = range[0];
	var max_y = range[range.length - 1];
	
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
	.range([min_x,max_x]);
	
	this.yScale
	.domain([min_y,max_y])
	.range([min_y,max_y]);
    
};

ChartView.prototype.update = function() {
	var that = this;
	
	/**
	 * We need to update domains, ranges, transformations
	 */
	this._updateDomainAndRange();
	this._updateTransformations();
		
	var ylines = this._svg.selectAll("line.y-line").data(this.yScale.ticks());
	
	ylines.exit().remove();
	ylines.enter().insert("line",":first-child").classed({"y-line":true});
	
	ylines
	.attr("x1", that._domainViewBox.x.min)
	.attr("x2", that._domainViewBox.x.max)
	.attr("y1", function(y) { return that._y(y); })
	.attr("y2", function(y) { return that._y(y); })

	this._series.forEach(function(series){
		try {
			series.pathInner.attr("stroke",series.series.color).transition().duration(500).attr("d",that._lineSeries(series.series.data));
			series.pathOuter.transition().duration(500).attr("d",that._lineSeries(series.series.data));
		} catch(e) {
			console.error("Error on Chartview.update on series ", series); 
		}
	});
	
	return this;
};

/** 
 * % in viewbox to values
 */
ChartView.prototype.fromRelativePositionToValues = function(pos) {
	return {
		x: this._inverse_x(pos.x * this._domainViewBox.x.max / 100.0),
		y: this._inverse_y(pos.y * this._domainViewBox.y.max / 100.0)
	};
};

/** From values to % in viewbox */
ChartView.prototype.fromValuesToRelativePosition = function(pos) {
	return {
		x: this._x(pos.x) * 100.0 /this._domainViewBox.x.max,
		y: this._y(pos.y) * 100.0 /this._domainViewBox.y.max
	};
};

makeObservable(ChartView);
