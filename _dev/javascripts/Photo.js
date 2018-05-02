
/**
 * 
 * @param {Manager} mapManager 
 * @prop {NodeElement} el : The photo manager container
 * @prop {NodeElement} canvas 
 * @prop {NodeElement} sidebar 
 * @prop {NodeElement} sidebarBtn
 * @prop {NodeElement} backBtn 
 * @prop {WebGLRenderer} renderer
 * @prop {Scene} scene
 * @prop {PerspectiveCamera} camera 
 * @prop {Post} post
 */
function PhotoManager(mapManager) {
	this.mapManager = mapManager;
	this.el = document.querySelector(".photo");
	this.canvas = document.querySelector("#photo");
	this.backBtn = document.querySelector(".photo__thumbnail-back");

	this.post = new Post(this.el);

	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
	this.renderer.setSize(window.innerWidth, window.innerHeight);

	this.scene = new THREE.Scene();

    // ajoute la caméra
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
	this.camera.position.z = 5;
	
	this.initSphereMesh();
    this.initParams();
	this.initEvents();
}


PhotoManager.prototype = {


	// Set the params of sphere
	initSphereMesh: function(){

		// création d'une sphère goémétrique
		this.geo = new THREE.SphereGeometry(40, 32, 32);
		
	    // this.geo.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

	    // création d'une sphère matérielle
	    this.material = new THREE.MeshBasicMaterial({
	    	side: THREE.BackSide
	    });

	 	this.sphereMesh = new THREE.Mesh(this.geo, this.material);
	    this.sphereMesh.name = "photo";
		this.sphereMesh.scale.x *= -1
	    this.scene.add(this.sphereMesh);
	},

	// Set control params
	initParams: function() {
		this.savedX = 0;
		this.savedY = 0;
		this.lon = 0;
		this.lat = 0;
		this.savedLongitude = 0;
		this.savedLatitude = 0;
		this.bManualControl = false;
	},


	/* Affichage
	Attend 1000ms que la transition du marker se termine puis : 
	- Met à jour le status
	- Affiche le layout photo
	- Render la scène 
	- Affiche la sidebar
	- Attend 1000ms de plus :
		- dézoome le marker
		- Cache la partie "Map" 
	*/
	display: function() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		setTimeout((function(){
			this.isDisplay = true; 
			this.el.classList.add("photo--display");
			this.backBtn.classList.add("photo__thumbnail-back--display");
			this.render();
			this.post.display = true
			setTimeout((function(){
				this.mapManager.currentMap.currentMarker.unzoom();
				this.mapManager.container.classList.add("visite__archive--hide");
			}).bind(this), 1000)

		}).bind(this), 1000)
	},

	/* 
	- Met à jour le status 
	- Cache la sidebar
	- Cache le layout photo
	 */
	hide: function(){
		this.isDisplay = false;
		this.post.display = false
		this.backBtn.classList.remove("photo__thumbnail-back--display");
		setTimeout((function(){
			this.el.classList.remove("photo--display"); 
			this.mapManager.container.classList.remove("visite__archive--hide");
		}).bind(this), 600)
	},

	setBackButton: function(marker) {
		var self = this
		this.map = marker.map.clone();
		this.map.metric = "%";
		this.map.refreshMarkerPositions();
		this.map.onClick = function(){
			if( self.mapManager.currentMap ){
				self.mapManager.currentMap.closePhoto();
			}
		}

		this.backBtn.innerHTML = "";
		this.backBtn.appendChild(this.map.el);
		
		var proto = ``
	},

	onPhotoLoad: function(texture) {
		this.material.map = texture;
		this.el.classList.remove("photo--loading");		
		this.display();
	},

	load: function(marker){
		this.el.classList.add("photo--loading");
		this.setBackButton(marker);
		var self = this;
		var loader = new THREE.TextureLoader(); 
		loader.load( marker.target, this.onPhotoLoad.bind(this) );
	},

	render: function(){
		if( this.isDisplay ){
			requestAnimationFrame(this.render.bind(this));// enregistre la fonction pour un appel récurrent 
		}

		if( this.autoRotate && this.lonSpeed == 0 && !this.bManualControl){
			this.lon += 0.05;
		}

	    if( Math.abs(this.lonSpeed ) > 0.5 && !this.bManualControl){
	    	this.lonSpeed *= 0.95
	    } else {
	    	this.lonSpeed = 0;
	    }

	    this.lon += this.lonSpeed;

	    // limitation de la latitude entre -85 et 85 (impossible de voir le ciel ou vos pieds)
	    this.lat = Math.max(-85, Math.min(85, this.lat));

	    // déplace la caméra en fonction de la latitude (mouvement vertical) et de la longitude (mouvement horizontal)
	    var vec = new THREE.Vector3(
	    	500 * Math.sin(THREE.Math.degToRad(90 - this.lat)) * Math.cos(THREE.Math.degToRad(this.lon)),
	    	500 * Math.cos(THREE.Math.degToRad(90 - this.lat)), 
	    	500 * Math.sin(THREE.Math.degToRad(90 - this.lat)) * Math.sin(THREE.Math.degToRad(this.lon))
	    );

	    this.camera.lookAt(vec);

	    // appel la fonction de rendu
	    this.renderer.render(this.scene, this.camera);
	},


	homogeneiseEvent: function(event){
		return event.touches && event.touches.length ? {
			x: event.touches[0].clientX,
			y: event.touches[0].clientY
		} : {
			x: event.clientX,
			y: event.clientY
		};
	},

	/**
	 * Events
	 */

	onDocumentMouseDown: function(event) {
	    event.preventDefault();
	    var coord = this.homogeneiseEvent(event);


	    this.autoRotate = false;

	    this.bManualControl = true;

	    this.savedX = coord.x;
	    this.savedY = coord.y;

	    this.savedLongitude = this.lon;
	    this.savedLatitude = this.lat;
	},

	onDocumentMouseMove: function(event){
	    // mise à jour si mode manuel
	    var coord = this.homogeneiseEvent(event);
	    if(this.bManualControl)
	    {

	    	this.lonSpeed = ((this.savedX - coord.x) / window.innerWidth) * Math.PI * 2 * 4;
	        this.lon = (this.savedX - coord.x) * 0.1 + this.savedLongitude;
	        this.lat = (coord.y - this.savedY) * 0.1 + this.savedLatitude;
	    }
	},

	onDocumentMouseUp: function(event) {
	    this.bManualControl = false;
	    this.autoRotate = true;
	},

	onDocumentResize: function(){
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	},

	initEvents: function(){
		var self = this;

		window.addEventListener("resize", this.onDocumentResize.bind(this), false);
		document.addEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
		document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
		document.addEventListener("mouseup", this.onDocumentMouseUp.bind(this), false);

		document.addEventListener("touchstart", this.onDocumentMouseDown.bind(this), false);
		document.addEventListener("touchmove", this.onDocumentMouseMove.bind(this), false);
		document.addEventListener("touchend", this.onDocumentMouseUp.bind(this), false);
	}

}