var AnnotationLayerView = function(element) {
	var that = this;
	this.root = element
	.classed({"annotation-layer":true})
	.on("mouseover",function(){
		var pos = d3.mouse(this);
		that.onMouseMoveOver(pos[0],pos[1]);
	})
	.on("mousemove",function(){
		var pos = d3.mouse(this);
		that.onMouseMoveOver(pos[0],pos[1]);
	})
	.on("mouseenter",function(){
		var pos = d3.mouse(this);
		that.onMouseMoveOver(pos[0],pos[1]);
	})
	.on("mouseleave",function(){
		that.fireEvent("mouseleave");
	});
	this.xAnnotation = this.makeAnnotationView().style("bottom",0);
};

AnnotationLayerView.prototype.onMouseMoveOver = function(x,y) {
	this.fireEvent("mousemove",x,y);
	return this;
};

AnnotationLayerView.prototype.showXPosition = function(x,str) {
	this.moveXPosition(x,str);
	this.xAnnotation.classed({"visible":true});
	return this;
};

AnnotationLayerView.prototype.moveXPosition = function(x,str) {
	this.xAnnotation
	.style({"left":x + "px"})
	.text(str)
	return this;
};

AnnotationLayerView.prototype.hideXPosition = function(str) {
	this.xAnnotation.classed({"visible":false});
	return this;
};

AnnotationLayerView.prototype.showDataPoint = function(dataPoint,x,y) {
	dataPoint.style({"left":x + "px","top":y+"px"}).classed({"visible":true});
	return this;
};

AnnotationLayerView.prototype.hideDataPoint = function(dataPoint) {
	dataPoint.classed({"visible":false});
	return this;
};

AnnotationLayerView.prototype.makeAnnotationView = function() {
	var annotation = this.root.append("div").classed({"annotation":true});
	return annotation;
};

AnnotationLayerView.prototype.makeDataPointView = function() {
	var point = this.root.append("svg").classed({"data-point":true}).attr("viewBox","0 0 32 32");
	point.append("circle").attr({"r":8,"cx":16,"cy":16});
	return point;
};

AnnotationLayerView.prototype.update = function() {
	return this;
};
	
makeObservable(AnnotationLayerView);