var YAxisView = function (element) {
	
	this.root = element;
	this.root.classed({
		"axis" : true,
		"y-axis" : true
	});
	
	this.svg = this.root.append("svg").attr("viewBox", "0 0 100 1000").attr("preserveAspectRatio", "none");
	this.pathAxis = this.svg.append("line").attr({"x1": 100, "y1": 0, "x2": 100, "y2": 1000});
};

YAxisView.prototype.setScale = function (scale) {
	var scaleTicks = scale.ticks();
	var domain = scale.domain();
	var a = 1000.0/(domain[0]-domain[1]);
	var b = -a*domain[1];
	
	var ticks = this.svg.selectAll("line.tick").data(scaleTicks);
	ticks.enter().append("line").classed({"tick":true});
	ticks
	.attr("y1",
		  function(d) {
			  return a*d + b;
	})
	.attr("y2",
		  function(d){
			  return a*d + b;
	})
	.attr("x1",0).attr("x2",100);
	ticks.exit().remove();
	
	var a = 100.0/(domain[0]-domain[1]);
	var b = -a*domain[1];
	var labels = this.root.selectAll("div.label").data(scaleTicks);
	labels.enter().append("div").classed({"label":true});
	labels.style("top",function(d){
		return a*d+b + "%";
	}).text(function(d,i){
		return scaleTicks[i];
	});
	labels.exit().remove();
	return this;
};
