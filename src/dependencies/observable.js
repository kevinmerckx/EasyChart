function makeObservable(obj) {
	
	obj.prototype.on = function(str,fct) {
		this.__observable = this.__observable ? this.__observable : {handlers:[]};
		
		if(!this.__observable.handlers[str]) {
			this.__observable.handlers[str] = [];
		}
		this.__observable.handlers[str].push(fct);
		return this;
	};
	
	obj.prototype.fireEvent = function(str) {
		if(!this.__observable.handlers[str]) {
			return;
		}
		var args = [].slice.call(arguments,1);
		this.__observable.handlers[str].forEach(function(fct) {
			fct.apply(null,args);
		});
		return this;
	};
};