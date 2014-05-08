var XAxisView = function (element) {
	
	this.root = element;
	this.root.classed({
		"axis" : true,
		"x-axis" : true
	});
	
	this.svg = this.root.append("svg").attr("viewBox","0 0 1000 100").attr("preserveAspectRatio","none");
	this.g = this.svg.append("g");
	this.pathAxis = this.g.append("path").attr("d","M0,0L1000,0");
};

XAxisView.prototype.setScale = function (scale) {
	return this;
};
