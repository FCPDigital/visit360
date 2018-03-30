
const SELECT= 1
const TOP= 4
const BOTTOM= 5
const REGULAR= 2

/**
 * A represent a floor
 * @param {HTMLNode} el 
 * @param {Manager} manager 
 * @var {Marker[]} markers
 */
function MapItem(el, manager) {
	this.el = el;
	this.id = this.el.getAttribute("id");
	this.manager = manager;
	this.markers = [];
	this.mode = REGULAR
	this.imageUrl = this.el.getAttribute("data-url");

	this._width = this.el.offsetWidth;
	this._height = this.el.offsetHeight;

	var markers = this.el.querySelectorAll(".marker");

	for(var i=0; i<markers.length; i++){
		this.markers.push(new Marker(markers[i], this));
	}

	this.initEvents();
}

MapItem.prototype = {

	/**
	 * Reference width & height
	 * @returns {int}
	 */
	get width(){
		return this._width;
	},

	get height(){
		return this._height;
	},

	set fade(isFade) {
		if( isFade ){
			this.el.classList.add("map--fade");
		} else {
			this.el.classList.remove("map--fade");
		}
	},

	clone: function(map, options) {
		var parsedEl = document.createElement("fragment").innerHTML = this.el.innerHTML;
		return new Map(parsedEl.firstChild, this.manager)
	},

	/**
	 * Init marker events
	 */

	initEvents: function(){
		for(var i=0; i<this.markers.length; i++){
			this.initEvent(this.markers[i]);
		}
	},

	initEvent: function(marker){
		var self = this;
		marker.el.addEventListener("click",function(){
			self.openPhoto(marker);
		}, false)
	},
	
	openPhoto: function(marker){
		var self = this;
		var position = marker.el.getBoundingClientRect();

		// Prepare zoom animation 
		this.manager.markerUtil.position = {x: position.x, y: position.y };
		this.manager.markerUtil.display();
		this.manager.markerUtil.el.classList.remove("marker--no-transition");
		
		// Update & load current marker
		this.currentMarker = marker;
		this.manager.photoManager.load(marker);
		
		// Launch zoom animation
		setTimeout(function(){
			self.manager.markerUtil.zoom();
		}, 40)
	},

	closePhoto: function(){
		var self = this;
		if( this.currentMarker ){

			// Launch leave animation
			this.manager.markerUtil.unzoom();
			this.manager.photoManager.hide();
			this.currentMarker = null;
			
			// Reset views 
			setTimeout(function(){
				self.manager.markerUtil.hide();
				self.manager.markerUtil.el.classList.add("marker--no-transition");
			}, 1100)
		}
	},

	/**
	 * Send map to top or bottom (hide)
	 */

	toTop: function() {
		this.el.classList.remove("map--bottom")
		this.el.classList.remove("map--select")
		this.el.classList.add("map--top")
		this.hideMarkers();
		this.cleanPosition();
		this.mode = TOP
	},

	toBottom: function() {
		this.el.classList.remove("map--top")
		this.el.classList.remove("map--select")
		this.el.classList.add("map--bottom")
		this.hideMarkers();
		this.cleanPosition();
		this.mode = BOTTOM
	},

	/**
	 * Send map to it's regular place
	 */
	toRegular: function(){
		this.setPosition();
		if( this.mode == SELECT ){
			this.hideMarkers();
		}

		this.el.classList.remove("map--top")
		this.el.classList.remove("map--bottom")
		this.el.classList.remove("map--select")
		this.mode = REGULAR
	},

	/**
	 * Launch focus action
	 */
	select: function(){
		if( this.mode != SELECT ){
		
			// Clean all behaviours (map--top, map--bottom) & select
			this.el.className = "map map--select"
			
			// Remove transformation
			this.cleanPosition();
			this.mode = SELECT
			this.fade = false;
			this.displayMarkers();
		}
	},


	/**
	 * onresize callback
	 */

	refreshBoundaries: function(){
		this._width = this.el.offsetWidth;
		this._height = this.el.offsetHeight;
	},

	refreshMarkerPositions: function(){
		this.refreshBoundaries();
		for(var i=0; i<this.markers.length; i++){
			this.markers[i].updateStyle();
		}
	},

	/**
	 * Manage markers
	 */

	hideMarkers: function() {
		for(var i=0; i<this.markers.length; i++){
			this.markers[i].hide();
		}
	},

	displayMarkers: function(){
		var self = this;
		for(var i=0; i<this.markers.length; i++){
			(function(rank){

				setTimeout(function(){
				
					self.markers[rank].display();
				
				}, rank*100 + 500)
			
			})(i);
		}
	},

	/**
	 * Update styles
	 */

	cleanPosition: function() {
		this.el.style.transform = null
	},

	setBackground: function(){
		this.el.style.backgroundImage = `url("${this.imageUrl}")`;
	},

	setPosition: function(translate) {
		if( translate ) this.translate = translate; 
		this.el.style.backgroundImage = `url("${this.imageUrl}")`
		this.el.style.transform = `translateX(-50%) translateY(-50%) rotateX(75deg) rotateZ(10deg) scale(0.9) translateZ(${this.translate}px)`
	}

}
