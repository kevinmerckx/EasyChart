/**
 * svg element with viewBox
 */
var EasyChart = function (selector) {
	var that = this;

	this._root = d3.select(selector).classed({"easychart":true});

	this._chartZone = this._root.append("div");
	this._chartView = new ChartView(this._chartZone);
	this._annotationLayer = new AnnotationLayerView(this._chartZone);

	this._xAxis = new XAxisView(this._root.append("div"));
	this._yAxis = new YAxisView(this._root.append("div"));

	this.series = [];

	this._annotationLayer
	.on("mousemove",function(mouse){
		that.fireEvent("mousemove",{
			pixel: mouse.pixel,
			relative : mouse.relative, 
			value: that._chartView.fromRelativePositionToValues(mouse.relative)
		});

		that.series.forEach(function(series){
			try {
			} catch(e) {
			}
		});
	})
	.on("mouseout",function(){

		that.fireEvent("mouseout");

		that.series.forEach(function(series){
			try {
			} catch(e) {
			}
		});
	});
};


// series.data = [{x:,y:}]
// series.color = "green"
// returns a Series object:
// - update 
EasyChart.prototype.addSeries = function(series) {
	var seriesObj = new Series(series);
	this.series.push(seriesObj);
	this._chartView.addSeries(seriesObj);
	return seriesObj;
};

EasyChart.prototype.update = function() {
	this._chartView.update();

	this._xAxis.setScale(this._chartView.xScale);
	this._yAxis.setScale(this._chartView.yScale);

	return this;
};

EasyChart.prototype.fromValuesToRelativePosition = function(pt) {
	return this._chartView.fromValuesToRelativePosition({x:pt.x,y:pt.y});
};

EasyChart.prototype.setXAxisScale = function(d3scale) {
	this._chartView.xScale = d3scale;
	return this;
};

makeObservable(EasyChart);

EasyChart.prototype.makeAnnotation = function(name) {
	return this._chartZone.append(name)
	.classed({
		annotation: true
	});
};

/**
 * Template annotations
 */
EasyChart.prototype.makeVerticalLine = function() {
	var svg = this.makeAnnotation("svg");
	svg.attr({
		"viewBox" : "0 0 1 1000",
		"perspectiveAspectRatio" : "none"
	})
	.classed({
		"vertical-line" : true
	})
	.append("line").attr({
		"x1":0,
		"x2":0,
		"y1":0,
		"y2":1000
	});
	return svg;
};

EasyChart.prototype.makeCirclePoint = function() {
	var svg = this.makeAnnotation("svg");
	svg.attr({
		viewBox: "0 0 31 31",
		"perspectiveAspectRatio" : "none"
	})
	.classed({
		"simple-circle": true
	})
	.append("circle")
	.attr({
		cx: 15,
		cy: 15,
		r: 8
	});
	return svg
};

