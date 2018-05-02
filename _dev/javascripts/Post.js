/**
 * The content, it is displayed by default as a sidebar 
 */
function Post(scope) {
    this._display = false;
    this.sidebar = scope.querySelector(".v360-photo__sidebar");
    this.sidebarBtn = scope.querySelector(".v360-photo__sidebar-close");
    this.title = scope.querySelector(".v360-photo__sidebar-title");
    this.content = scope.querySelector(".v360-photo__sidebar-content");
    this.data = {};
    this.initEvents();
}

Post.prototype = {
    updateFromJson: function(response) {
        this.data = JSON.parse(response);
        
        this.title.innerHTML = this.data.title;
        this.content.innerHTML = this.data.content;
    },

    get display() {
        return this._display;
    },

    set display(isDisplay) {
        if( isDisplay ) {
            console.log("Display")
            this._display = true; 
            this.sidebar.classList.add("v360-photo__sidebar--display");
            this.sidebarBtn.classList.remove("v360-photo__sidebar-close--reverse");
        } else {
            console.log("Hide")
            this._display = false; 
            this.sidebar.classList.remove("v360-photo__sidebar--display");
            this.sidebarBtn.classList.add("v360-photo__sidebar-close--reverse");
        }
    },

    initEvents: function(){
        var self = this;
        this.sidebarBtn.addEventListener("click", function(){
            self.display = self.display ? false : true
        })
    }
}
