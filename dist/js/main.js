$().ready(function(){var e=window.com||{};e.shellybrown=e.shellybrown||{};var t=function(e){this.selector=e,this.$el=$(this.selector)};t.prototype={buildPages:function(){this.$el.empty();for(var e=0;e<this.pages.length;e++)this.$el.append(this.pages[e].$el);$("#Content").onepage_scroll({sectionContainer:"section",loop:!1,easing:"ease",pagination:!1,updateURL:!1,keyboard:!0,responsiveFallback:!1,direction:"horizontal"})},init:function(){this.imagesQueued=0;var e=this;$.ajax({method:"GET",url:"data.json"}).done(function(t){e.dataLoaded(t)})},dataLoaded:function(e){"string"==typeof e&&(e=JSON.parse(e)),this.imagePath=e.image_path,this.pages=e.pages,this.loadImages()},imageLoaded:function(e,t){this.pages[t].$el.html(e),this.imagesQueued--;var a=(this.pages.length-this.imagesQueued)/this.pages.length;$("#PercentComplete").html(100*a|0),0===this.imagesQueued&&this.buildPages()},loadImages:function(){var e,t=this;this.pages.map(function(a,i){a.$el=$('<section class="page"></section>'),e=new Image,t.imagesQueued++,e.onload=function(){t.imageLoaded(this,i)},e.src=t.imagePath+a.image})}},e.shellybrown.lookbook=new t("#Content"),e.shellybrown.lookbook.init()});