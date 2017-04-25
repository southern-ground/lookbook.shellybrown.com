$().ready(function(){

    var com = window.com || {};
    com.shellybrown = com.shellybrown || {};

    var Lookbook = function (el) {
        this.selector = el;
        this.$el = $(this.selector);
    };

    Lookbook.prototype = {
        buildPages: function () {

            this.$el.empty();

            for(var i = 0; i < this.pages.length; i++){
                if(i === 0){
                    this.pages[i].$el.append('<div class="instructions">Swipe up or down <em>or</em> use your Up and Down arrow keys.</div>');
                }
                this.$el.append(this.pages[i].$el);
            }

            $('#Content').onepage_scroll({
                sectionContainer: "section",
                loop: false,
                easing: "ease",
                pagination: false,
                updateURL: false,
                keyboard: true,
                responsiveFallback: false,
                direction: "horizontal"
            });

        },
        init: function () {

            this.imagesQueued = 0;
            var scope = this;
            $.ajax({
                method: "GET",
                url: "data.json"
            })
                .done(function (msg) {
                    scope.dataLoaded(msg);
                });

        },
        dataLoaded: function (data) {

            if(typeof data === "string"){
                data = JSON.parse(data);
            }

            this.imagePath = data.image_path;
            this.pages = data.pages;

            this.loadImages();

        },
        imageLoaded: function (which, index) {

            this.pages[index].$el.html(which);
            this.imagesQueued--;
            var perc = (this.pages.length - this.imagesQueued) / this.pages.length;
            $('#PercentComplete').html((perc * 100) | 0);
            if (this.imagesQueued === 0) {
                this.buildPages();
            }

        },
        loadImages: function () {

            var img;
            var _scope = this;
            this.pages.map(function(item,index){
                item.$el = $('<section class="page"></section>');
                img = new Image();
                _scope.imagesQueued++;
                img.onload = function () {
                    _scope.imageLoaded(this, index);
                };
                img.src = _scope.imagePath + item.image;
            });

        }
    };

    com.shellybrown.lookbook = new Lookbook('#Content');
    com.shellybrown.lookbook.init();

});