/**
 * svg element with viewBox
 */
var EasyChart = function (selector) {
	var that = this;
	
	this._root = d3.select(selector).classed({"easychart":true});
	
	this._annotationLayer = this._root.append("div").classed({"annotation-layer":true});
	this._annotationLayer.on("mousemove",function(){
		var pos = d3.mouse(this);
		// get (x,y) with x and y in value coordinates
		console.log(pos , " ---- > " ,that._chartView.fromPixelsToValues(pos[0],pos[1]));
		that._chartView.showXVericalLine(that._chartView.fromPixelsToValues(pos[0],pos[1]).x);
	});
	this._chartView = new EasyChartView(this._root.append("svg"));

};

// series.data = [{x:,y:}]
	// series.legend = "My legend"
	// series.color = "green"
	// returns a Series object:
	// - update 
EasyChart.prototype.addSeries = function(series) {
	var seriesObj = this._chartView.addSeries(series);
	this.update();
	return seriesObj;
};

/**
 *
 */
// TODO OPTIMIZE

EasyChart.prototype.update = function() {
	this._chartView.update();
	return this;
};

