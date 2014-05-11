var AnnotationLayerView = function(element) {
	var that = this;
	this.root = element;
	
	var onMouseOver = function(pos) {
		that.fireEvent("mousemove",pos[0],pos[1]);
	};
	
	this.root
	.classed({"annotation-layer":true})
	.on("mouseover",function(){
		onMouseOver(d3.mouse(this));
	})
	.on("mousemove",function(){
		onMouseOver(d3.mouse(this));
	})
	.on("mouseout",function(){
		that.fireEvent("mouseout");
	});
	
};

makeObservable(AnnotationLayerView);
