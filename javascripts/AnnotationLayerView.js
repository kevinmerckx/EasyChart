var AnnotationLayerView = function(element) {
	var that = this;
	this.root = element;
	
	var onMouseOver = function(pos) {
		var data = {
			pixel: {
				x: pos[0],
				y: pos[1]
			}
		};
		data.relative = that.fromPixelsToRelativePosition(data.pixel);
		that.fireEvent("mousemove",data);
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


/** 
 * From pixels to percentage %
 */
AnnotationLayerView.prototype.fromPixelsToRelativePosition = function(pos) {
	var rect = this.root[0][0].getBoundingClientRect();
	var a_x = 100.0/(rect.width-1);
	var a_y = 100.0/(rect.height-1);
	return {
		x: a_x * pos.x,
		y: a_y * pos.y
	};
};

AnnotationLayerView.prototype.fromRelativePositionToPixels = function(pos) {
	var rect = this.root[0][0].getBoundingClientRect();
	// first convert into viewbox pixels
	var a_x = (rect.width-1)/100.0;
	var a_y = (rect.height-1)/100.0;
	return {
		x: a_x*pos.x,
		y: a_y*pos.y
	};
};