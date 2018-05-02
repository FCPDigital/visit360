function NavMap (manager) {

	this.el = manager.el.querySelector(".v360-nav");
	this.items = manager.el.querySelectorAll(".v360-nav__item");
	for(var i=0; i<this.items.length; i++){
		this.initEvent(this.items[i]);
	}

	this.initPointer();
	this.manager = manager; 
}


NavMap.prototype = {

	initPointer: function() {
		this.pointer = document.createElement("div");
		this.pointer.classList.add("v360-nav__pointer");
		this.el.appendChild(this.pointer);
	},

	movePointerTo: function(rank) {
		this.pointer.style.top = this.items[0].offsetTop + 50 + 170*rank + "px";
		this.pointer.classList.add("v360-nav__pointer--active")
	},

	initEvent: function(item){
		var self = this;
		item.addEventListener("click", function(){
			var rank = self.manager.getMapRankFromId(this.getAttribute("data-map"));
			console.log(rank);
			if(rank >= 0){
				self.manager.select(rank);
			}
		})
	},

	responsive: function(){
		this.el.classList.add("v360-nav--responsive");
	},

	desktop: function(){
		this.el.classList.remove("v360-nav--responsive");
	},
	
	selectFromMap: function(map){
		this.unSelectAll();
		for(var i=0; i<this.items.length; i++){
			if( this.items[i].getAttribute("data-map") == map.id ){
				this.items[i].classList.add("v360-nav__item--active");
				this.movePointerTo(i);
			} else {
				this.items[i].classList.add("v360-nav__item--disable");
			}
		} 
	},

	unSelectAll: function(){
		for(var i=0; i<this.items.length; i++){
			this.items[i].classList.remove("v360-nav__item--active");
			this.items[i].classList.remove("v360-nav__item--disable");
		} 
		this.pointer.classList.remove("v360-nav__pointer--active")
	}
}