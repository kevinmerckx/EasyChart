var Series = function(series) {
	this.data = series.data || [];
	this.color = series.color || "blue";
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

makeObservable(Series);