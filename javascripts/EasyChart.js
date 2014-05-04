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
		
		that._chartView.showXVericalLine(values.x);
		that._annotationLayer.showXPosition(x,values.x);
		that.series.forEach(function(series){
			var nearestPoint = series.series.nearestPoint(values.x);
			var pixelsPosition = that._chartView.fromValuesToRelativePosition(nearestPoint);
			that._annotationLayer.showDataPoint(series.highlightPoint.style("stroke",series.series.color), pixelsPosition.x, pixelsPosition.y);
		});
	}).on("mouseleave",function(){
		that._annotationLayer.hideXPosition();
		that._chartView.hideXVericalLine();
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
	
	if(this.state.valuesOnMouse) {
		var pos = this._chartView.fromValuesToRelativePosition(this.state.valuesOnMouse);
		this._chartView.moveXVericalLine(this.state.valuesOnMouse.x);
		this._annotationLayer.moveXPosition(pos.x,this.state.valuesOnMouse.x);
		that.series.forEach(function(series){
			var nearestPoint = series.series.nearestPoint(that.state.valuesOnMouse.x);
			var pixelsPosition = that._chartView.fromValuesToRelativePosition(nearestPoint);
			that._annotationLayer.showDataPoint(series.highlightPoint.style("stroke",series.series.color), pixelsPosition.x, pixelsPosition.y);
		});
	}
	
	
	return this;
};

