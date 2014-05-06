/**
 * svg element with viewBox
 */
var EasyChart = function (selector) {
	var that = this;
	
	this._root = d3.select(selector).classed({"easychart":true});
	
	this._annotationLayer = new AnnotationLayerView(this._root.append("div"));
	this.series = [];
	this.state = {
		// valuesOnMouse.x & valuesOnMouse.y
	};
	
	this._annotationLayer
	.on("mousemove",function(x,y){
		var relativePosition = that._chartView.fromPixelsToRelativePosition({x:x,y:y});
		var values = that._chartView.fromRelativePositionToValues(relativePosition);
		
		// we save the state
		that.state.valuesOnMouse = {
			x: values.x,
			y: values.y
		};
		
		that.updateOnMouseMoveAnnotations();
		
		that._annotationLayer.showXPosition();
		that.series.forEach(function(series){
			that._annotationLayer.showDataPoint(series.highlightPoint.color(series.series.color));
		});
	}).on("mouseleave",function(){
		that._annotationLayer.hideXPosition();
		that.series.forEach(function(series){
			that._annotationLayer.hideDataPoint(series.highlightPoint);
		});
	});
	this._chartView = new ChartView(this._root.append("svg"));

};

// series.data = [{x:,y:}]
	// series.legend = "My legend"
	// series.color = "green"
	// returns a Series object:
	// - update 
EasyChart.prototype.addSeries = function(series) {
	var seriesObj = new Series(series);
	this.series.push({
		series: seriesObj,
		highlightPoint: this._annotationLayer.makeDataPointView()
	});
	this._chartView.addSeries(seriesObj);
	this.update();
	return seriesObj;
};

EasyChart.prototype.update = function() {
	var that = this;
	this._chartView.update();
	
	this.updateOnMouseMoveAnnotations();
	
	return this;
};

EasyChart.prototype.updateOnMouseMoveAnnotations = function() {
	var that = this;
	if(this.state.valuesOnMouse) {
		var pos = this._chartView.fromValuesToRelativePosition(this.state.valuesOnMouse);
		this._annotationLayer.moveXPosition(pos.x,that._chartView.xScale.tickFormat()(this.state.valuesOnMouse.x));
		that.series.forEach(function(series){
			var nearestPoint = series.series.nearestPoint(that.state.valuesOnMouse.x);
			var pixelsPosition = that._chartView.fromValuesToRelativePosition(nearestPoint);
			that._annotationLayer.moveDataPoint(series.highlightPoint.color(series.series.color).text(that._chartView.yScale.tickFormat()(nearestPoint.y)), pixelsPosition.x, pixelsPosition.y);
		});
	}
};

