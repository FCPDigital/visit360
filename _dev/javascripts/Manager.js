/**
 * Manager of all visit
 * @param {HTMLNode} el 
 */
function MapManager(el) {
	this.el = el;
	this.maps = [];
	this.createMarkerUtil();
	this.photoManager = new PhotoManager(this);
	this.container = this.el.querySelector(".v360-visite__archive");
	this.closeMapButton = this.el.querySelector("#v360-close-map-button");
	this.nav = new NavMap(this);
	this.isResponsive = false; 

	this.init();
} 



MapManager.prototype = {

	config: {
		step: 150,
		navWidth: 150,
		offset: 10,
		width: 500,
		height: 500,
		breakPoint: 650
	},

	/**
	 * @return {Integer} The height of all visit 
	 */
	get height(){
		var offset = 0;
		if( this.isResponsive ){
			offset = 100;
		}
		return this.maps.length * this.config.height * 0.2 + (this.maps.length - 1) * this.config.step + offset; 
	},

	/**
	 * @return {Integer} The offset (used to calculate space between maps)
	 */
	get offset(){
		return this.isResponsive ? this.config.offset + 50 : this.config.offset;
	},

	/**
	 * Create an invisible marker used for transition
	 */
	createMarkerUtil: function() {
		var element = document.createElement("div");
		element.id = "v360-visite-marker-transition-util"; 
		element.className = "v360-marker v360-marker--overall v360-marker--no-transition";
		element.innerHTML = "<div class='v360-marker__point'></div>"
		document.body.appendChild(element);
		this.markerUtil = new Marker(element, null);
	},

	/**
	 * Return the map from it ID 
	 * @param {Integer?} id
	 */
	getMapRankFromId: function(id){
		for(var i=0; i<this.maps.length; i++){
			if(this.maps[i].id == id) {
				return i; 
			}
		}
		return null;
	},

	/**
	 * Choose regular mode (the original mode)
	 * Minify all maps
	 */
	regular: function(){
		
		var n = this.maps.length;
		var h = n - 1 * this.config.step; 

		for(var i = 0; i < this.maps.length; i++){
			this.maps[i].setPosition(-1*i * this.config.step - h/2 + this.offset);
			this.maps[i].fade = false;
		}
		this.currentMap = null;
		this.mode = "regular";
		this.closeMapButton.classList.remove("v360-map__close--display");

		this.nav.unSelectAll();

	},

	/**
	 * Focus on a specific map 
	 * This mode is fired on map's hover
	 * @param {Integer?} rank
	 */
	focus: function(rank){
		var n = this.maps.length;
		var h = n - 1 * this.config.step; 

		for(var i = 0; i < this.maps.length; i++){
			var decal = 0;
			if( i < rank) {
				decal = 20; 
			} else if( i > rank) {
				decal = -20;
			}

			this.maps[i].fade = rank == i ? false : true;
			this.maps[i].setPosition(-1*i * this.config.step - h/2 + this.offset + decal);
		}

		this.mode = "focus";
	},

	/**
	 * Select a specific map
	 * This mode is fired when the user click on a map. 
	 * @param {Integer} rank
	 */
	select: function(rank) {

		for(var i=0; i<this.maps.length; i++){
			if( i < rank ){
				this.maps[i].toTop(); // If before target, hide by top slide
			} else if( i > rank ) {
				this.maps[i].toBottom(); // If after target, hide by bottom slide
			} else {
				this.maps[i].select(); // If good : select, save currentMap and current mode
				this.currentMap = this.maps[i];
				this.mode = "map";
			}
		}

		// Update right navigation and display close button
		this.nav.selectFromMap(this.currentMap);
		this.closeMapButton.classList.add("v360-map__close--display");
	},


	////////////////////////////////
	//
	//		Responsive
	//
	////////////////////////////////

	responsive: function(){
		this.isResponsive = true; 
		this.nav.responsive();
	},

	desktop: function(){
		this.isResponsive = false; 
		this.nav.desktop();
	},

	/**
	 * Refresh all the markers position when a resizing is done
	 */
	refreshAllMarkersPosition: function() {
		for(var i=0; i<this.maps.length; i++) {
			this.maps[i].refreshMarkerPositions();
		}
	},


	////////////////////////////////
	//
	//		Initialisation
	//
	////////////////////////////////

	/**
	 * Used in window.onresize & initialisation
	 */
	onResize: function(){
		var w = this.el.offsetWidth; 

		// Manage responsive mode
		if( w < this.config.width + this.config.navWidth || window.innerWidth < this.config.breakPoint ) {
			this.responsive();
		} else {
			this.desktop();
		}

		switch (this.mode){
			case "regular": this.regular(); break;
			case "focus": this.focus(); break;
		}

		// refresh boundaries and markers position
		for(var i=0; i<this.maps.length; i++){
			this.maps[i].refreshBoundaries();
		}
		this.refreshAllMarkersPosition();
		setTimeout(this.refreshAllMarkersPosition.bind(this), 500)

		// Refresh height from getter
		this.container.style.height = this.height + "px";
	},

	/**
	 * Init single map event
	 * @param {Map} map
	 * @param {Integer} rank
	 */
	initMapEvent: function(map, rank){
		var self = this; 

		map.el.addEventListener("mouseenter", function(){
			if( self.mode != "map"){
				self.focus(rank);	
			}
		})

		map.el.addEventListener("mouseleave", function(){
			if( self.mode != "map") {
				self.regular();	
			}
		})

		map.el.addEventListener("click", function(){
			self.select(rank);
		})
	},

	/**
	 * Init all the events
	 */
	initEvents: function(){
		var self = this;

		// Maps events
		for(var i=0; i<this.maps.length; i++){
			this.initMapEvent(this.maps[i], i);
		}

		// Close button click
		this.closeMapButton.addEventListener("click", function(){
			self.regular();
			for(var i=0; i<self.maps.length; i++){
				self.maps[i].toRegular();
			}
		})

		// Onresize
		window.addEventListener("resize", self.onResize.bind(this));
	},

	/**
	 * Initialisation
	 */
	init: function(){
		var maps = this.el.querySelectorAll(".v360-map"); 	
		for(var i=0; i<maps.length; i++){
			this.maps.push(new MapItem(maps[i], this));
		}

		this.onResize();
		this.initEvents();
		this.regular();
	}
}
