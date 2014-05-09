var XAxisView = function (element) {
	
	this.root = element;
	this.root.classed({
		"axis" : true,
		"x-axis" : true
	});
	
	this.svg = this.root.append("svg").attr("viewBox", "0 0 1000 100").attr("preserveAspectRatio", "none");
	this.pathAxis = this.svg.append("line").attr({"x1": 0, "y1": 0, "x2": 1000, "y2": 0});
};

XAxisView.prototype.setScale = function (scale) {
	var scaleTicks = scale.ticks();
	var domain = scale.domain();
	var a = 1000.0/(domain[1]-domain[0]);
	var b = -a*domain[0];
	
	var ticks = this.svg.selectAll("line.tick").data(scaleTicks);
	ticks.enter().append("line").classed({"tick":true});
	ticks
	.attr("x1",
		  function(d) {
			  return a*d + b;
	})
	.attr("x2",
		  function(d){
			  return a*d + b;
	})
	.attr("y1",0).attr("y2",100);
	ticks.exit().remove();
	
	var a = 100.0/(domain[1]-domain[0]);
	var b = -a*domain[0];
	var labels = this.root.selectAll("div.label").data(scaleTicks);
	labels.enter().append("div").classed({"label":true});
	labels.style("left",function(d){
		return a*d+b + "%";
	}).text(function(d,i){
		return scaleTicks[i];
	});
	labels.exit().remove();
	return this;
};
