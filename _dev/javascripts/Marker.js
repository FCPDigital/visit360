function offset(elem) {
    if(!elem) elem = this;

    var x = elem.offsetLeft;
    var y = elem.offsetTop;

    while (elem = elem.offsetParent) {
        x += elem.offsetLeft;
        y += elem.offsetTop;
    }

    return { x: x, y: y };
}


function Marker(el, map, options) {
	this.el = el;
	this.map = map;
	this.options = options ? options : {};
	this.extractInfo();
}


Marker.prototype = {

	get absolutePosition(){
		return offset(this.el);
	},

	get style(){
		if( this.map ) {
			return `top: ${this.position.y*this.map.width}px; left: ${this.position.x*this.map.height}px;`	
		}
		
		return `top: ${this.position.y}px; left: ${this.position.x}px;`	

	},

	extractInfo: function(){
		var arg = this.el.getAttribute("data-marker");
		if( arg ){
			this.data = JSON.parse(arg);
		} else {
			this.data = {x: 0, y: 0, url: ""};
		}
		this.position = {
			x: this.data.x, 
			y: this.data.y
		}
		this.target = this.data.url;
	},

	updateStyle: function(){
		this.el.setAttribute("style", this.style);
	},

	display: function(){
		this.updateStyle();
		this.el.classList.add("marker--display");
	},
	
	hide: function(){
		this.el.classList.remove("marker--display");
	},

	zoom: function(){
		this.el.classList.add("marker--zoom");
	},

	unzoom: function(){
		this.el.classList.remove("marker--zoom");
	}

}