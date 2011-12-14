/*
 * Minimit Gallery Plugin
 * Version: 1.02
 * Copyright (C) 2011 by Riccardo Caroli http://www.minimit.com
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * For updates visit http://www.minimit.com/works/minimit-gallery-plugin
 */
 
/*
 * Initialize the Minimit Gallery (feel free to skip arguments if optional or if you are using default)
 * @function mg_init(options:object)
 * 	@param options.reference:string [Required] - gallery string reference
 * 	@param options.activated:array [Optional] - array of numbers for activated items on init - no activated on init if undefined
 * 	@param options.click:object [Optional] - arguments for click interactions as follows
 * 	@param options.click.interactive:boolean [Default:false] - if the items are interactive on click
 * 	@param options.click.linked:array [Optional] - array of reference strings for linked galleries
 * 	@param options.click.max_activated:number [Default:Infinity] - maximum amount of activated items - unlimited if undefined
 * 	@param options.click.deactivable:boolean [Default:false] - if the click activated items can be deactivated on click
 * 	@param options.click.less:number [Optional] - how many you want before activated in the multiple data - nothing if undefined
 * 	@param options.click.plus:number [Optional] - how many you want after activated in the multiple data - nothing if undefined
 * 	@param options.click.automatic:number [Optional] - milliseconds for automatic gallery
 * 	@param options.click.automaticpause:number [Optional] - milliseconds for automatic gallery pause when user interacts
 * 	@param options.click.automaticinverse:boolean [Default:false] - false for automatic to next, true for automatic to prev
 * 	@param options.hover:object [Optional] - same as options.click but for mouse hover interactions
 * 	@param options.out:object [Optional] - same as options.click but for mouse out interactions
 * 	@param options.interaction.prevsteps:number [Default:1] - how many to jump on prev
 * 	@param options.interaction.nextsteps:number [Default:1] - how many to jump on next
 * 	@param options.interaction.prevtosteps:boolean [Default:false] - for prev, true if the items scrolls all the way, false if the items scrolls only to show first and last
 * 	@param options.interaction.nexttosteps:boolean [Default:false] - for next, true if the items scrolls all the way, false if the items scrolls only to show first and last
 * 	@param options.interaction.cycle:boolean [Default:false] - if the items cycle
 */
function mg_init(options) {
	this["reference"] = options.reference;
	this["activated"] = typeof(options.activated) != 'undefined' ? options.activated : [];
	// click
	if(options.click){
		var interactive_click = options.click.interactive;
		this[reference+"_activated_click"] = [];
		this[reference+"_linked_click"] = options.click.linked;
		this[reference+"_max_activated_click"] = options.click.max_activated;
		this[reference+"_deactivable_click"] = options.click.deactivable;
		this[reference+"_less_click"] = options.click.less;
		this[reference+"_plus_click"] = options.click.plus;
		this[reference+"_automatic_click"] = options.click.automatic;
		this[reference+"_automaticpause_click"] = options.click.automaticpause;
		this[reference+"_automaticinverse_click"] = options.click.automaticinverse;
	}
	// over
	if(options.hover){
		var interactive_hover = options.hover.interactive;
		this[reference+"_activated_hover"] = [];
		this[reference+"_linked_hover"] = options.hover.linked;
		this[reference+"_max_activated_hover"] = options.hover.max_activated;
		this[reference+"_deactivable_hover"] = options.hover.deactivable;
		this[reference+"_less_hover"] = options.hover.less;
		this[reference+"_plus_hover"] = options.hover.plus;
		this[reference+"_automatic_hover"] = options.hover.automatic;
		this[reference+"_automaticpause_hover"] = options.hover.automaticpause;
		this[reference+"_automaticinverse_hover"] = options.hover.automaticinverse;
	}
	// out
	if(options.out){
		var interactive_out = options.out.interactive;
		this[reference+"_activated_out"] = [];
		this[reference+"_linked_out"] = options.out.linked;
		this[reference+"_max_activated_out"] = options.out.max_activated;
		this[reference+"_deactivable_out"] = options.out.deactivable;
		this[reference+"_less_out"] = options.out.less;
		this[reference+"_plus_out"] = options.out.plus;
		this[reference+"_automatic_out"] = options.out.automatic;
		this[reference+"_automaticpause_out"] = options.out.automaticpause;
		this[reference+"_automaticinverse_out"] = options.out.automaticinverse;
	}
	// interaction
	if(options.interaction){
		this[reference+"_prevsteps"] = typeof(options.interaction.prevsteps) != 'undefined' ? options.interaction.prevsteps : 1;
		this[reference+"_nextsteps"] = typeof(options.interaction.nextsteps) != 'undefined' ? options.interaction.nextsteps : 1;
		this[reference+"_prevtosteps"] = options.interaction.prevtosteps;
		this[reference+"_nexttosteps"] = options.interaction.nexttosteps;
		this[reference+"_cycle"] = options.interaction.cycle;
	}else{
		this[reference+"_prevsteps"] = 1;
		this[reference+"_nextsteps"] = 1;
	}
	// set links
	mg_initLinks(reference, interactive_click, interactive_hover, interactive_out);
	// set init
	if(activated.length>0){
		for (var i in activated){
			mg_setState(reference, activated[i], "_init", false, false);
		}
	}else{
		mg_setState(reference, null, "_init", false, false);
	}
	// set automatic
	mg_automatic(reference, "_click");
	mg_automatic(reference, "_over");
	mg_automatic(reference, "_out");
};
$.ajaxSetup ({
    // Disable caching of AJAX responses */
    cache: false
});
/*
 * Set automatic timing
 * @function mg_automatic(reference, append)
 * 	@param reference:string - gallery string reference
 * 	@param append:string - "_click" or "_hover" or "_out"
 */
function mg_automatic(reference, append){
	var time = this[reference+"_automatic"+append];
	var inverse = this[reference+"_automaticinverse"+append];
	if(time != undefined){
		clearInterval(this[reference+"_timeout"+append]);
		clearInterval(this[reference+"_timeoutpause"+append]);
		if(inverse){
			this[reference+"_timeout"+append] = this.setInterval(function(){mg_prev(reference,false);}, time);
		}else{
			this[reference+"_timeout"+append] = this.setInterval(function(){mg_next(reference,false);}, time);
		}
	}
}

/*
 * Set automatic pause timing on interaction
 * @function mg_automaticpause(reference, append)
 * 	@param reference:string - gallery string reference
 * 	@param append:string - "_click" or "_hover" or "_out"
 */
function mg_automaticpause(reference, append){
	var time = this[reference+"_automaticpause"+append];
	if(time != undefined){
		clearInterval(this[reference+"_timeout"+append]);
		clearInterval(this[reference+"_timeoutpause"+append]);
		this[reference+"_timeoutpause"+append] = this.setInterval(function(){mg_automatic(reference, append);}, time);
	}
}

/*
 * Set automatic pause timing on interaction
 * @function mg_setState(reference, num, append, alsolinked)
 * 	@param reference:string - gallery string reference
 * 	@param num:number - item number of the gallery
 * 	@param append:string - "_click" or "_hover" or "_out"
 * 	@param alsolinked:boolean - if it propagates to linked galleries
 * 	@param pauseautomatic:boolean - if it pause the automatic
 */
function mg_setState(reference, num, append, alsolinked, pauseautomatic){
	var time = this[reference+"_automatic"+append];
	var func = this[reference+append];
	if(append=="_init"){append="_click";} // transform init append to click to have right target etc..
	//
	var old_target = this[reference+"_target"+append];
	var target = this[reference+"_target"+append] = num;
	var deactivable = this[reference+"_deactivable"+append];
	if(func != undefined){
		var activated = this[reference+"_activated"+append];
		var deactivated = mg_deactivate(reference, num, append);
		var less = this[reference+"_less"+append];
		var plus = this[reference+"_plus"+append];
		var cycle = this[reference+"_cycle"];
		var prevsteps = this[reference+"_prevsteps"];
		var nextsteps = this[reference+"_nextsteps"];
		var prevtosteps = this[reference+"_prevtosteps"];
		var nexttosteps = this[reference+"_nexttosteps"];
		var multiple = mg_set_mutiple(reference, target, old_target, prevsteps, nextsteps, less, plus, prevtosteps, nexttosteps, cycle);
		func(reference, activated, deactivated, prevsteps, nextsteps, multiple, cycle);
		// enable and disable text selection on non deactivable items
		if(!deactivable){ for(var i=0; i<activated.length; i++){ mg_enableTextSelect($("#"+reference+"-"+activated[i])); } mg_disableTextSelect($("#"+reference+"-"+deactivated)); }
	}
	// propagate to linked
	if(alsolinked){
		var linked = this[reference+"_linked"+append];
		for (var i in linked){ // execute linked galleries
			mg_setState(linked[i], num, append, false, true);
		}
	}
	// pause automatic
	if(pauseautomatic){
		mg_automaticpause(reference, append);
	}
}

/*
 * Return multiple object to return in setState
 */
function mg_set_mutiple(reference, target, old_target, prevsteps, nextsteps, less, plus, prevtosteps, nexttosteps, cycle){
	mg_checkPrev(reference, prevsteps, nextsteps, less, plus, prevtosteps, nexttosteps, cycle);
	mg_checkNext(reference, prevsteps, nextsteps, less, plus, prevtosteps, nexttosteps, cycle);
	if(plus+less > 0){ // calculate mutiple only if plus and less != 0
		var length = $("[id^="+reference+"-]:not([id*=prev]):not([id*=next]):not([id*=first]):not([id*=last])").length;
		var multiple_activated = mg_mapNum(target, less, plus, length, cycle);
		var multiple_old_activated = mg_mapNum(old_target, less, plus, length, cycle);
		var dist = mg_findNearestDistance(target, old_target, length, cycle)
		//
		var multiple = {};
		multiple.activated = multiple_activated;
		multiple.old_activated = multiple_old_activated;
		multiple.less = less;
		multiple.plus = plus;
		multiple.distance = dist;
		multiple.jumped = dist;
		multiple.before_in = [];
		multiple.before_out = [];
		multiple.after_in = [];
		multiple.after_out = [];
		multiple.direction = 1;
		//
		if(old_target == null){ // prevents multiple animations for the init animation
			return multiple;
		}
		if(dist > 0){ // going right
			multiple.direction = 1;
			for(var i=0; i<Math.abs(dist); i++){
				multiple.after_in.unshift(multiple_activated[multiple_old_activated.length-i-1]);
				multiple.before_out.unshift(multiple_old_activated[dist-i-1]);
			}
		}else{ // going left
			multiple.direction = 0;
			for(var i=0; i<Math.abs(dist); i++){
				multiple.before_in.push(multiple_activated[-dist-i-1]);
				multiple.after_out.push(multiple_old_activated[multiple_old_activated.length-i-1]);
			}
		}
		return multiple;
	}else{
		return null;
	}
}

/*
 * Calculate deactivated item, remove it from activated array and return deactivated item
 */
function mg_deactivate(reference, num, append){
	var activated = this[reference+"_activated"+append];
	var max_activated = this[reference+"_max_activated"+append];
	var deactivable = this[reference+"_deactivable"+append];
	var spliced = null;
	if(num != null){ // not the null because we start with them with no activation
		var idx = $.inArray(num, activated);
		if(idx != -1){ // if the number activated is already on the activated array
			if(deactivable){
				spliced = parseFloat(activated.splice(idx, 1)) // disactivate the activate one
			}; 
		}else{ // if num was already in activated
			if(activated.length >= max_activated){ // if activated are more than max_activated
				spliced = parseFloat(activated.splice(activated.length-1, 1)); // remove the last
			}
			activated.unshift(num);
		}
	}
	return spliced;
}

/*
 * Initialize gallery links
 */
function mg_initLinks(reference, interactive_click, interactive_hover, interactive_out){
	// items
	var num = 0;
	while($("#"+reference+"-"+num).length!=0){
		if(interactive_click){
			mg_disableTextSelect($("#"+reference+"-"+num));
			$("#"+reference+"-"+num).live('click', function() {
				var half = $(this).attr('id').lastIndexOf("-");
				var reference = $(this).attr('id').slice(0,half);
				mg_setState(reference, parseFloat($(this).attr('id').slice(half+1)), "_click", true, true);
				return false;
			});
		}
		if(interactive_hover){
			$("#"+reference+"-"+num).live('mouseenter', function() {
				var half = $(this).attr('id').lastIndexOf("-");
				var reference = $(this).attr('id').slice(0,half);
				mg_setState(reference, parseFloat($(this).attr('id').slice(half+1)), "_hover", true, true);
				return false;
			});
		}
		if(interactive_out){
			$("#"+reference+"-"+num).live('mouseleave', function() {
				var half = $(this).attr('id').lastIndexOf("-");
				var reference = $(this).attr('id').slice(0,half);
				mg_setState(reference, parseFloat($(this).attr('id').slice(half+1)), "_out", true, true);
				return false;
			});
		}
		num++;
	}
	//  prev, next, first, last
	mg_disableTextSelect($("#"+reference+"-prev"));
	$("#"+reference+"-prev").live('click', function() {
		var half = $(this).attr('id').lastIndexOf("-");
		mg_prev(reference, true);
		return false;
	});
	mg_disableTextSelect($("#"+reference+"-next"));
	$("#"+reference+"-next").live('click', function() {
		var half = $(this).attr('id').lastIndexOf("-");
		mg_next(reference, true);
		return false;
	});
	mg_disableTextSelect($("#"+reference+"-first"));
	$("#"+reference+"-first").live('click', function() {
		var half = $(this).attr('id').lastIndexOf("-");
		mg_setState(reference, 0, "_click", true, true);
		return false;
	});
	mg_disableTextSelect($("#"+reference+"-last"));
	$("#"+reference+"-last").live('click', function() {
		var half = $(this).attr('id').lastIndexOf("-");
		mg_setState(reference, $("[id^="+reference+"-]:not([id*=prev]):not([id*=next]):not([id*=first]):not([id*=last])").length-1, "_click", true, true);
		return false;
	});
}

/*
 * Function to manage prev interactions
 */
function mg_prev(reference, pauseautomatic){
	var append = "_click";
	var cycle = this[reference+"_cycle"];
	var length = $("[id^="+reference+"-]:not([id*=prev]):not([id*=next]):not([id*=first]):not([id*=last])").length;
	var prevsteps = this[reference+"_prevsteps"];
	var prevtosteps = this[reference+"_prevtosteps"];
	var target=parseFloat(this[reference+"_target_click"])-prevsteps;
	var less = this[reference+"_less"+append];
	var plus = this[reference+"_plus"+append];
	if(prevtosteps && !cycle){
		if(target<0-less){ // if target is out of prev bounds
			target = 0-less;
		}
	}else{
		if(target<0){ // if target is out of prev bounds
			if(cycle){
				target = length-Math.abs(target);
			}else{
				target = 0;
			}
		}
	}
	mg_setState(reference, target, append, true, pauseautomatic);
}

/*
 * Function to manage next interactions
 */
function mg_next(reference, pauseautomatic){
	var append = "_click";
	var cycle = this[reference+"_cycle"];
	var length = $("[id^="+reference+"-]:not([id*=prev]):not([id*=next]):not([id*=first]):not([id*=last])").length;
	var nextsteps = this[reference+"_nextsteps"];
	var nexttosteps = this[reference+"_nexttosteps"];
	var target=this[reference+"_target"+append]+nextsteps;
	var less = this[reference+"_less"+append];
	var plus = this[reference+"_plus"+append];
	if(nexttosteps && !cycle){
		if(target>length-1+plus){ // if target is out of next bounds
			target = length-1+plus;
		}
	}else{
		if(target>length-1){ // if target is out of next bounds
			if(cycle){
				target = Math.abs(target)-length;
			}else{
				target = this[reference+"_target_click"];
			}
		}
	}
	mg_setState(reference, target, append, true, pauseautomatic);
}

/*
 * Function to manage show and hide of prev
 */
function mg_checkPrev(reference, prevsteps, nextsteps, less, plus, prevtosteps, nexttosteps, cycle){
	var length = $("[id^="+reference+"-]:not([id*=prev]):not([id*=next]):not([id*=first]):not([id*=last])").length;
	if(!cycle){
		var target = parseFloat(this[reference+"_target_click"])-prevsteps;
		if(prevtosteps){
			if(target<0-less-plus){
				var func = this[reference+"_prevhide"];
				if(func != undefined){	func(reference, prevsteps);	}
			}else{
				var func = this[reference+"_prevshow"];
				if(func != undefined){	func(reference, prevsteps);	}
			}
		}else{
			if(target<0){
				var func = this[reference+"_prevhide"];
				if(func != undefined){	func(reference, prevsteps);	}
			}else{
				var func = this[reference+"_prevshow"];
				if(func != undefined){	func(reference, prevsteps);	}
			}
		}
	}
}

/*
 * Function to manage show and hide of next
 */
function mg_checkNext(reference, prevsteps, nextsteps, less, plus, prevtosteps, nexttosteps, cycle){
	var length = $("[id^="+reference+"-]:not([id*=prev]):not([id*=next]):not([id*=first]):not([id*=last])").length;
	if(!cycle){
		var target = this[reference+"_target_click"]+nextsteps;
		if(nexttosteps){
			if(target>length-less-plus-1){
				var func = this[reference+"_nexthide"];
				if(func != undefined){	func(reference, nextsteps);	}
			}else{
				var func = this[reference+"_nextshow"];
				if(func != undefined){	func(reference, nextsteps);	}
			}
		}else{
			if(target>length-1){
				var func = this[reference+"_nexthide"];
				if(func != undefined){	func(reference, nextsteps);	}
			}else{
				var func = this[reference+"_nextshow"];
				if(func != undefined){	func(reference, nextsteps);	}
			}
		}
	}
}

/*
 * Maps a serie of numbers based on num +- add, between 0 and max (ex: 4, 5, 0, 1, 2)
 * @function mg_mapnum(num:number, less:number, plus:number, max:number, cycle:boolean)
 * 	@param num - number
 * 	@param less - additional before the num
 * 	@param plus - additional after the num
 *	@param max - maximum number
 *	@param cycle - if the values cycle, from max to 0 and vice versa
 */
function mg_mapNum(num, less, plus, max, cycle){
	var arr=[];
	for(var i=-less;i<=plus;i++){
		if(num+i<max || cycle){ // here if num>max we put null because the item doesn't exist, except with cycle
			if(num+i<0 && cycle){
				arr.push(max-(-num-i));
			}else if(num+i>=max && cycle){
				arr.push(num+i-max);
			}else{
				arr.push(num+i);
			}
		}else{
			arr.push(null);
		}
	}
	return arr;
}

/*
 * Returns the distance between num and center, with center having the lowest number, based on max and min (ex: 2,1,0,1,2)
 * @function mg_mapDistance(max:number, min:number, center:number, num:number)
 * 	@param center - to number
 * 	@param num - from number
 */
function mg_mapDistance(center, num){
	return center-num;
}

/*
 * Returns the reverse distance between num and center, with center having the highest number, based on max and min (ex: 0,1,2,1,0)
 * @function mg_mapDistanceReverse(center:number, num:number, max:number, min:number)
 * 	@param center - to number
 * 	@param num - from number
 *	@param max - max number
 * 	@param min - min number
 */
function mg_mapDistanceReverse(center, num, max, min){
	var max_distance = max-min;
	if (num==center){
		return center;
	}else if(num<max_distance/2){
		return -num;
	}else if(num>max_distance/2){
		return (max_distance-num-1);
	}else{
		return max_distance/2;
	}
}

/*
 * Returns the nearest distance between i and z, considering values from 0 to max
 * The distance evaluate the nearest considering cycling from 0 to max if cycle is true
 * @function mg_findNearestDistance(i:number, z:number, max:number, cycle:boolean)
 * 	@param i - from number
 * 	@param z - to number
 *	@param max - max number of values
 *	@param cycle - if the values cycle, from max to 0 and vice versa
 */
function mg_findNearestDistance(i, z, max, cycle){
	var maxDist = max/2;
	if(!cycle || (i-z<maxDist && i-z>-maxDist)){ // not cycle or into the max distance limits
		return (i-z);
	}else if(i-z>maxDist){ // if we are going right over the limits
		if(z>i){
			return (-i-(max-z));
		}else{
			return (-z-(max-i));
		}
	}else if(i-z<-maxDist){ // if we are going left over the limits
		if(z>i){
			return (i+(max-z));
		}else{
			return (z+(max-i));
		}
	}
};

/*
 * Function for disable text selection
 * @function mg_disableTextSelect(obj:Object)
 * 	@param obj - Jquery object to disable text
 */
function mg_disableTextSelect(obj){
	obj.each(function() { 
        this.onselectstart = function() { return false; }; 
        this.unselectable = "on"; 
        jQuery(this).css('user-select', 'none'); 
        jQuery(this).css('-o-user-select', 'none'); 
        jQuery(this).css('-moz-user-select', 'none'); 
        jQuery(this).css('-khtml-user-select', 'none'); 
        jQuery(this).css('-webkit-user-select', 'none'); 
    });
}

/*
 * Function for enable text selection
 * @function mg_enableTextSelect(obj:Object)
 * 	@param obj - Jquery object to enable text
 */
function mg_enableTextSelect(obj){
	obj.each(function() { 
        this.onselectstart = function() {}; 
        this.unselectable = "off"; 
        jQuery(this).css('user-select', 'text'); 
        jQuery(this).css('-o-user-select', 'text'); 
        jQuery(this).css('-moz-user-select', 'text'); 
        jQuery(this).css('-khtml-user-select', 'text'); 
        jQuery(this).css('-webkit-user-select', 'text'); 
    });
}
