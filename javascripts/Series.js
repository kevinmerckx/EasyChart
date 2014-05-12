var Series = function(series) {
	this.data = series.data || [];
	this.color = series.color || "blue";
	
	this._yScale = d3.scale.linear();
	this._x = function(x) {};
	this._inverseX = function(x) {};
	this._y = function(y) {};
	this._inverseY = function(y) {};
};

Series.prototype.domain = function() {
	if(this.data.length === 0) {
		return;
	}
	return {
		x:{
			min: d3.min(this.data,function(d){
				return d.x;
			}),
			max: d3.max(this.data,function(d){
				return d.x;
			})
		},
		y:{
			min: d3.min(this.data,function(d){
				return d.y;
			}),
			max: d3.max(this.data,function(d){
				return d.y;
			})
		}
	};
};

Series.prototype.nearestPoint = function(x) {
	if(this.data.length === 0){
		return;
	}
	var x_values = this.data.map(function(pt){
		return pt.x;
	});
	var dist = x_values.map(function(_x){return Math.abs(x - _x);});
	var idx = dist.indexOf(d3.min(dist));
	return {
		x:this.data[idx].x,
		y: this.data[idx].y
	};
};

Series.prototype.update = function() {
	var tmpDomain = this.domain();
	// we update the scale
	this._yScale.domain([tmpDomain.y.min,tmpDomain.y.max]);
	
	return this;
};

makeObservable(Series);