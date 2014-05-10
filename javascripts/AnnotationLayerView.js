var AnnotationLayerView = function(element) {
	var that = this;
	this.root = element
	.classed({"annotation-layer":true}).on("mouseover",function(){
		var pos = d3.mouse(this);
		that.onMouseMoveOver(pos[0],pos[1]);
	})
	.on("mousemove",function(){
		var pos = d3.mouse(this);
		that.onMouseMoveOver(pos[0],pos[1]);
	})
	.on("mouseout",function(){
		that.fireEvent("mouseout");
	});
	
	this.xAnnotation = new VerticalLineAnnotationView(this.root);
};

AnnotationLayerView.prototype.onMouseMoveOver = function(x,y) {
	this.fireEvent("mousemove",x,y);
	return this;
};

AnnotationLayerView.prototype.showXPosition = function() {
	this.xAnnotation.show();
	return this;
};

AnnotationLayerView.prototype.moveXPosition = function(x,str) {
	this.xAnnotation.text(str).x(x + "%");
	return this;
};

AnnotationLayerView.prototype.hideXPosition = function() {
	this.xAnnotation.hide();
	return this;
};

AnnotationLayerView.prototype.moveDataPoint = function(dataPoint,x,y) {
	dataPoint.center(x + "%", y + "%");
	return this;
};

AnnotationLayerView.prototype.hideDataPoint = function(dataPoint) {
	dataPoint.hide();
	return this;
};

AnnotationLayerView.prototype.showDataPoint = function(dataPoint) {
	dataPoint.show();
	return this;
};

AnnotationLayerView.prototype.makeAnnotationView = function() {
	var annotation = this.root.append("div").classed({"annotation":true});
	return annotation;
};

AnnotationLayerView.prototype.makeDataPointView = function() {
	return new DataPointView(this.root);
};

AnnotationLayerView.prototype.update = function() {
	return this;
};

makeObservable(AnnotationLayerView);

/**
 * VerticalLineAnnotationView
 */
var VerticalLineAnnotationView = function(parent) {
	this.div = parent.append("div").classed({"annotation":true, "vertical-annotation":true});
	this.svg = this.div.append("svg").attr("viewBox","0 0 2 1000");
	this.svg.append("path").attr("d","M0,0L0,1000L2,1000L2,0");
	this.divText = this.div.append("div").classed({"annotation":true,"text":true});
};

VerticalLineAnnotationView.prototype.show = function() {
	this.div.classed({"visible":true});
	return this;
};

VerticalLineAnnotationView.prototype.hide = function() {
	this.div.classed({"visible":false});
	return this;
};

VerticalLineAnnotationView.prototype.x = function(x) {
	this.div.style({
		"left":x
	});
	this._switchLeftOrRight();
	return this;
};

VerticalLineAnnotationView.prototype.text = function(str) {
	this.divText.text(str);
	this._switchLeftOrRight();
	return this;
};

VerticalLineAnnotationView.prototype._switchLeftOrRight = function() {
	// TODO
	return this;
};

/**
 * DataPointView
 */
var DataPointView = function(parent) {
	this.div = parent.append("div").classed({"data-point":true});
	this.svg = this.div.append("svg").attr("viewBox","0 0 31 31");
	this.svg.append("circle").attr({"r":10,"cx":15,"cy":15});
	this.span = this.div.append("span").classed({"annotation":true});
};

DataPointView.prototype.show = function() {
	this.div.classed({"visible":true});
	return this;
};

DataPointView.prototype.hide = function() {
	this.div.classed({"visible":false});
	return this;
};

DataPointView.prototype.center = function(x,y) {
	this.div.style({"left":x,"top":y});
	return this;
};

DataPointView.prototype.text = function(str) {
	this.span.text(str);
	return this;
};

DataPointView.prototype.color = function(color) {
	this.svg.style("stroke",color);
	this.span.style({
		"background-color":color,
		 "color":"white"
	});
	return this;
};