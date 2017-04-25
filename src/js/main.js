$().ready(function(){

    var com = window.com || {};
    com.shellybrown = com.shellybrown || {};

    var Lookbook = function (el) {
        this.selector = el || "#Content";
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
                responsiveFallback: false
            });

        },
        init: function () {
            this.$el = $(this.selector);
            this.imagesQueued = 0;
            this.params = this.getQueryParams();
            this.dataFile = (this.params.y || "2017") + "_" + (this.params.s || "spring") + ".json";
            var scope = this;
            $.ajax({
                method: "GET",
                url: "./data/" + this.dataFile
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

        },
        getQueryParams: function(url){
            // get query string from url (optional) or window
            var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

            // we'll store the parameters here
            var obj = {};

            // if query string exists
            if (queryString) {

                // stuff after # is not part of query string, so get rid of it
                queryString = queryString.split('#')[0];

                // split our query string into its component parts
                var arr = queryString.split('&');

                for (var i=0; i<arr.length; i++) {
                    // separate the keys and the values
                    var a = arr[i].split('=');

                    // in case params look like: list[]=thing1&list[]=thing2
                    var paramNum = undefined;
                    var paramName = a[0].replace(/\[\d*\]/, function(v) {
                        paramNum = v.slice(1,-1);
                        return '';
                    });

                    // set parameter value (use 'true' if empty)
                    var paramValue = typeof(a[1])==='undefined' ? true : a[1];

                    // (optional) keep case consistent
                    paramName = paramName.toLowerCase();
                    paramValue = paramValue.toLowerCase();

                    // if parameter name already exists
                    if (obj[paramName]) {
                        // convert value to array (if still string)
                        if (typeof obj[paramName] === 'string') {
                            obj[paramName] = [obj[paramName]];
                        }
                        // if no array index number specified...
                        if (typeof paramNum === 'undefined') {
                            // put the value on the end of the array
                            obj[paramName].push(paramValue);
                        }
                        // if array index number specified...
                        else {
                            // put the value at that index number
                            obj[paramName][paramNum] = paramValue;
                        }
                    }
                    // if param name doesn't exist yet, set it
                    else {
                        obj[paramName] = paramValue;
                    }
                }
            }

            return obj;
        }
    };

    com.shellybrown.lookbook = new Lookbook();
    com.shellybrown.lookbook.init();

});