
var SELECT= 1;
var TOP= 4;
var BOTTOM= 5;
var REGULAR= 2;

/**
 * A represent a floor
 * @param {HTMLNode} el 
 * @param {Manager} manager 
 * @var {Marker[]} markers
 */
function MapItem(el, manager) {
  this.el = el;
  this.metric = "px";
  this.id = this.el.getAttribute("id");
  this.manager = manager ? manager : null;
  this.markers = [];
  this.isOpenningPhoto = false;
  this.mode = REGULAR
  this.imageUrl = this.el.getAttribute("data-url");
  this.onClick = null;
  this._width = this.el.offsetWidth;
  this._height = this.el.offsetHeight;

  var markers = this.el.querySelectorAll(".v360-marker");

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
      this.el.classList.add("v360-map--fade");
    } else {
      this.el.classList.remove("v360-map--fade");
    }
    this._fade = isFade;
  },

  get fade(){
    return this._fade;
  },

  clone: function(map, options) {
    var parsedEl = document.createElement("fragment");
    parsedEl.innerHTML = this.el.outerHTML;
    var mapCloned = parsedEl.firstChild; 
    mapCloned.id = mapCloned.id +"-miniature";

    return new MapItem(mapCloned, this.manager)
  },

  /**
   * Init marker events
   */

  initEvents: function(){
    var self = this;
    for(var i=0; i<this.markers.length; i++){
      this.initEvent(this.markers[i]);
    }
    this.el.addEventListener("click", function(){
      if( self.onClick && !self.isOpenningPhoto ){
        self.onClick.call(this)
      }
    })
  },

  initEvent: function(marker){
    var self = this;
    marker.el.addEventListener("click",function(event){
      event.preventDefault();
      self.isOpenningPhoto = true; 
      self.openPhoto(marker);
      event.stopPropagation();
    }, false)
  },
  
  openPhoto: function(marker){
    var self = this;
    jQuery.post(
      ajaxurl,
      {
        'action': 'mon_action',
        'param': marker.id
      }, function(response) {
        self.manager.photoManager.post.updateFromJson(response)
      }
    );
    var position = marker.el.getBoundingClientRect();

    // Prepare zoom animation 
    if( this.manager ) {
      this.manager.markerUtil.position = {x: position.x, y: position.y };
      this.manager.markerUtil.display();
      this.manager.markerUtil.el.classList.remove("v360-marker--no-transition");
      this.manager.photoManager.load(marker);
    }
    
    // Update & load current marker
    this.currentMarker = marker;
    
    // Launch zoom animation
    setTimeout(function(){
      if( self.manager ){
        self.manager.markerUtil.zoom();
      }
      self.isOpenningPhoto = false; 
    }, 40)
  },

  closePhoto: function(){
    var self = this;
    if( this.currentMarker ){

      // Launch leave animation
      if( this.manager ){
        this.manager.markerUtil.unzoom();
        this.manager.photoManager.hide();
      }
      
      this.currentMarker = null;
      
      // Reset views 
      setTimeout(function(){
        if( self.manager ){
          self.manager.markerUtil.hide();
          self.manager.markerUtil.el.classList.add("v360-marker--no-transition");
        }
      }, 1100)
    }
  },

  /**
   * Send map to top or bottom (hide)
   */

  toTop: function() {
    this.el.classList.remove("v360-map--bottom")
    this.el.classList.remove("v360-map--select")
    this.el.classList.add("v360-map--top")
    this.hideMarkers();
    this.cleanPosition();
    this.mode = TOP
  },

  toBottom: function() {
    this.el.classList.remove("v360-map--top")
    this.el.classList.remove("v360-map--select")
    this.el.classList.add("v360-map--bottom")
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

    this.el.classList.remove("v360-map--top")
    this.el.classList.remove("v360-map--bottom")
    this.el.classList.remove("v360-map--select")
    this.mode = REGULAR
  },

  /**
   * Launch focus action
   */
  select: function(){
    if( this.mode != SELECT ){
    
      // Clean all behaviours (map--top, map--bottom) & select
      this.el.className = "v360-map v360-map--select"
      
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
    if( this.metric == "%") {
      this._width = 100;
      this._height = 100;
    } else {
      this._width = this.el.offsetWidth;
      this._height = this.el.offsetHeight;
    }
  },

  refreshMarkerPositions: function(){
    this.refreshBoundaries();
    for(var i=0; i<this.markers.length; i++){
      this.markers[i].updateStyle();
      this.markers[i].unfocus();
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
    this.el.style.backgroundImage = "url(\""+this.imageUrl+"\")";
  },

  setPosition: function(translate) {
    if( translate ) this.translate = translate; 
    this.el.style.backgroundImage = "url(\""+this.imageUrl+"\")";
    this.el.style.transform = "translateX(-50%) translateY(-50%) rotateX(75deg) rotateZ(10deg) scale(0.9) translateZ(" + this.translate + "px)";
  }
}
