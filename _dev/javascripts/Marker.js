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
	this.point = this.el.querySelector(".marker__point");
	this.bubble = this.el.querySelector(".marker__bubble");
	this.map = map;
	this.options = options ? options : {};
	this.extractInfo();
	
	if(this.point) {	 
		this.setBubblePosition();
		this.initEvents();
	}
}


Marker.prototype = {

	get absolutePosition(){
		return offset(this.el);
	},

	get style(){
		if( this.map ) {
			return `top: ${this.position.y*this.map.width}${this.map.metric}; left: ${this.position.x*this.map.height}${this.map.metric};`	
		}
		
		return `top: ${this.position.y}px; left: ${this.position.x}px;`	
	},

	setBubblePosition: function() {
		var limit = 1 - (140 / 450); // 140 (bubble height) 450 (map height)
		if( this.position.y > limit ) {
			this.bubble.classList.add("marker__bubble--bottom");
		}
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
		this.id = this.data.id;
		this.target = this.data.photo;
		this.thumbnail = this.data.thumbnail;
	},

	initEvents: function() {
		var self = this;
		this.point.addEventListener("mouseenter", function() {
			if( window.innerWidth > 650 ){
				self.focus();
			}
		});
		this.point.addEventListener("mouseleave", function(){
			self.unfocus();
		});
	},

	updateStyle: function(){
		this.el.setAttribute("style", this.style);
	},

	focus: function() {
		if( this.bubble ){
			this.bubble.classList.replace("marker__bubble--hidden", "marker__bubble--visible");
		}
	},

	unfocus: function() {
		if( this.bubble ){
			this.bubble.classList.replace("marker__bubble--visible", "marker__bubble--hidden");
		}
	},

	display: function(){
		this.updateStyle();
		this.el.classList.add("marker--display");
	},
	
	hide: function(){
		this.el.classList.remove("marker--display");
	},	

	zoom: function(){
		if( this.point ){
			this.point.classList.add("marker__point--zoom");
		}
	},

	unzoom: function(){
		if( this.point ){
			this.point.classList.remove("marker__point--zoom");
		}
	}

}