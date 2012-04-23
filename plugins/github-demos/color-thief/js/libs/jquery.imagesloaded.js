/*!
 * jQuery imagesLoaded plugin v1.0.4
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */
(function($,undefined){$.fn.imagesLoaded=function(callback){var $this=this,$images=$this.find("img").add($this.filter("img")),len=$images.length,blank="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";function triggerCallback(){callback.call($this,$images)}function imgLoaded(event){if(--len<=0&&event.target.src!==blank){setTimeout(triggerCallback);$images.unbind("load error",imgLoaded)}}if(!len){triggerCallback()}$images.bind("load error",imgLoaded).each(function(){if(this.complete||this.complete===undefined){var src=this.src;this.src=blank;this.src=src}});return $this}})(jQuery);