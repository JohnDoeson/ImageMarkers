;(function(jQuery) {
	var data = [];
	var obj = {};
	var using = false;
	var options = {
		element : 'none',
		display_mode : 'display',
		mapmarkerClass : 'marker'

	};

	function MapMarker (el,opt) {
		options.element = el;
		options.display_mode = opt.display_mode;
		this.init();
	}
	MapMarker.prototype.init = function() {
		var is_saveable = false;
		var widget = this;
		this.displayData();
		if (options.display_mode == 'display') {
			return;
		};
		var newId;
		var modalHTML = jQuery('#modalOptions > div');
		var refreshDialogHTML = modalHTML.html();

		modalHTML.dialog({
			autoOpen: false,
			close: function () {
				widget.refreshDialog(modalHTML,refreshDialogHTML);
				using = false;
				if (!is_saveable) {

					widget.deleteDataById(newId);
				};
				is_saveable = false;
			}

		});

		
		var el = options.element;
		var el_h = el.height();
		var el_w = el.width();

		el.click(function(event) {
			if (using) {
				return;
			};
			
			event.preventDefault();
			//console.log(el.children("img"));
			if (event.target.id != "markerTarget") {
				return;
			};

			using = true;
			modalHTML.dialog('open');

			obj = {};
			obj.type = "1";
			var offset = jQuery(this).offset();
			var relativeX = (event.pageX - offset.left);
			var relativeY = (event.pageY - offset.top);
			console.log(relativeX,relativeY);
			persX = (relativeX/el_w).toFixed(3);
			persY = (relativeY/el_h).toFixed(3);

			obj.x = persX;
			obj.y = persY;
			obj.size = 20;
			obj.clr = 1;
			newId = widget.generateId();
			var Idtmp = newId;
			obj.Id = newId;
			widget.buildStandartMarker(relativeX,relativeY,newId);

			var fontSizeTmp = false;

			jQuery("input[name='type']").click(function(){
				var type = document.querySelector('input[name="type"]:checked').value;
				obj.type = type;
				if (type == 1) {
					jQuery("#"+newId+" > span").remove();
					fontSizeTmp = false;
					jQuery("#"+newId).removeClass("hiddenBg");
				};
				if (type == 2) {
					jQuery("#"+newId).addClass("hiddenBg");

				};

			});

			jQuery( "#sliderSize" ).slider({
		    	value: 20,
		    	min: 0,
		    	max: 500,
		    	step: 1,
		    	slide: function( event, ui ) {
		    		var beforeSize = jQuery("#sliderSizeBefore").val();
		    		var diff = (ui.value - beforeSize)/2;
		    		var pos = jQuery("#"+newId).position();
		    		var newLeft = pos.left - diff, newTop = pos.top - diff;
		    		jQuery("#"+newId).css("top",newTop).css("left",newLeft).css("width", ui.value).css("height", ui.value);
		    		jQuery("#sliderSizeBefore").val(ui.value);
		    		if (obj.type == 2) {
		    			jQuery("#"+newId+" > span").css("font-size", ui.value-2);
		    		};

		    		obj.x = (newLeft/el_w).toFixed(3);
		    		obj.y = (newTop/el_h).toFixed(3);
		    		obj.size = (ui.value/el_w).toFixed(3);
		    	}
		    });

		    jQuery("#"+newId).draggable({
				stop: function () {
					var position = jQuery("#" + newId).position();
					obj.x = (position.left/el_w).toFixed(3);
					obj.y = (position.top/el_h).toFixed(3);
					console.log(obj);
				}
			});
			jQuery('.clr-selector').click(function(){
				var clr = jQuery(this).data("clr");
				var div = jQuery("#" + newId);
				switch (clr) {
		    		case 1:
		    			div.css("background-color","rgba(0, 235, 7, 0.1)").css("border","1px solid rgba(0, 235, 7, 1)").css("color","rgba(0, 235, 7, 1)");
		    			div.children(".markerTitle").css("color","rgba(0, 235, 7, 1)");
		    		break;
		    		case 2:
		    			div.css("background-color","rgba(211, 219, 0, 0.1)").css("border","1px solid rgba(211, 219, 0, 1)").css("color","rgba(211, 219, 0, 1)");
		    			div.children(".markerTitle").css("color","rgba(211, 219, 0, 1)");
		    		break;
		    		case 3:
		    			div.css("background-color","rgba(232, 42, 42, 0.1)").css("border","1px solid rgba(232, 42, 42, 1)").css("color","rgba(232, 42, 42, 1)");
		    			div.children(".markerTitle").css("color","rgba(232, 42, 42, 1)");
		    		break;
		    		default:
		    			div.children(".markerTitle").css("color","rgba(0, 235, 7, 1)");
		    			div.css("background-color","rgba(0, 235, 7, 0.1)").css("border","1px solid rgba(0, 235, 7, 1)").css("color","rgba(0, 235, 7, 1)");
		    	}
		    	obj.clr = clr;
				
			});
			
			jQuery('.icon-selector').click(function(){
				var icon = jQuery(this).data("icon");
				var div = jQuery("#" + newId);
				if (fontSizeTmp != false) {
					jQuery("#" + newId + "> span").removeClass(fontSizeTmp).addClass("glyphicon-"+icon);
				};
				if (!fontSizeTmp) {
					var fntSz = (div.width() - 2);
					jQuery("<span></span>").appendTo(div).addClass("glyphicon glyphicon-"+icon).css("font-size", fntSz);
				};

				fontSizeTmp = "glyphicon-"+icon;
				obj.icon = "glyphicon-"+icon;
				
				
			});

			jQuery('#'+newId+' > .markerTitle').click(function(){
				jQuery("#" + newId).draggable("disable");
				data.push(obj);
				is_saveable = true;
				modalHTML.dialog('close');
				widget.storeData();


				console.log(data);
			});

			jQuery('#Title').change(function(){
				jQuery('#'+newId+' > .markerTitle').text(jQuery('#Title').val());
			});

			jQuery('#saveMarker').click(function(){
				obj.title = jQuery('#Title').val();
				obj.mssg = jQuery('#Message').val();
				jQuery("#" + newId).draggable("disable");
				data.push(obj);
				is_saveable = true;
				modalHTML.dialog('close');
				widget.storeData();

				jQuery("<div></div>").appendTo(jQuery("#" + newId)).addClass("markerMssg").text(obj.mssg).css("color","rgba(0, 235, 7, 1)").css("left",-((100 - obj.size)/2)-2).css("bottom",(obj.size+15) + "px");
				jQuery("<span></span>").appendTo(jQuery("#" + newId + " > .markerMssg")).addClass("deleteMark glyphicon glyphicon-remove").attr("id","D"+newId);


				

				jQuery("#D" + newId).click(function () {
					widget.deleteDataById(Idtmp);
				});


				jQuery("#" + newId).click(function(){
					console.log(312);
					jQuery(this).children(".markerMssg").toggle();
				});
			});
			


		});

		
		
	}
	MapMarker.prototype.displayData = function() {
		var widget = this;
		widget.importData();
		console.log(data);
		var obj;
		var el = options.element;
		var el_h = el.height();
		var el_w = el.width();

		for (var i = 0; i < data.length; i++) {
			
			obj = data[i];
			var x = parseFloat(obj.x);
			var y = parseFloat(obj.y);
			x = (x*el_w) - (obj.size/2);
			y = (y*el_h) - (obj.size/2);
			var brd, bgc, tclr,ttl;

			switch (obj.clr) {
		    	case 1:
		    		bgc = "rgba(0, 235, 7, 0.1)";
		    		brd = "1px solid rgba(0, 235, 7, 1)";
		    		tclr = "rgba(0, 235, 7, 1)";
		    		ttl = "rgba(0, 235, 7, 1)";
		    	break;
		    	case 2:
		    		bgc = "rgba(211, 219, 0, 0.1)";
		    		brd = "1px solid rgba(211, 219, 0, 1)";
		    		tclr = "rgba(211, 219, 0, 1)";
		    		ttl = "rgba(211, 219, 0, 1)";
		    	break;
		    	case 3:
		    		bgc = "rgba(232, 42, 42, 0.1)";
		    		brd = "1px solid rgba(232, 42, 42, 1)";
		    		tclr = "rgba(232, 42, 42, 1)";
		    		ttl = "rgba(232, 42, 42, 1)";
		    	break;
		    	default:
		    		bgc = "rgba(0, 235, 7, 0.1)";
		    		brd = "1px solid rgba(0, 235, 7, 1)";
		    		tclr = "rgba(0, 235, 7, 1)";
		    		ttl = "rgba(0, 235, 7, 1)";
		    }

		    if (obj.type == "2") {
		    	console.log(2);
		    	jQuery('<div></div>').appendTo(options.element).addClass(options.mapmarkerClass).css("left",x).css("top",y).css("width",obj.size*el_w).css("height",obj.size*el_w).attr("id",obj.Id).css("background-color","transparent");
		    	jQuery("<span></span>").appendTo(jQuery("#" + obj.Id)).addClass("glyphicon "+obj.icon).css("font-size", obj.size - 2).css("color",ttl);
		   
		    } else {
		    	console.log(1);
		    	jQuery('<div></div>').appendTo(options.element).addClass(options.mapmarkerClass).css("left",x).css("top",y).css("width",obj.size*el_w).css("height",obj.size*el_w).css("background-color",bgc).css("border",brd).attr("id",obj.Id);
		    };


			jQuery('<div></div>').appendTo(jQuery("#"+obj.Id)).addClass("markerTitle");

			jQuery("#"+obj.Id).children(".markerTitle").css("color",ttl).text(obj.title);


			jQuery("<div></div>").appendTo(jQuery("#" + obj.Id)).addClass("markerMssg").text(obj.mssg).css("color","rgba(0, 235, 7, 1)").css("left",-((100 - obj.size)/2)-2).css("bottom",(obj.size+15) + "px");

			if (options.display_mode == 'admin') {
				jQuery("<span></span>").appendTo(jQuery("#" + obj.Id + " > .markerMssg")).addClass("deleteMark glyphicon glyphicon-remove").attr("id","D"+obj.Id);

				jQuery("#D"+obj.Id).click(function() {
					var id =  this.id;
					id = id.substr(1);
					widget.deleteDataById(id);

				});
			};
			

			jQuery("#"+obj.Id).click(function() {
				jQuery(this).children(".markerMssg").toggle();

			});


		};
		
	}
	MapMarker.prototype.storeData = function() {

		var jsonString = JSON.stringify(data);
		jQuery("#json_storage").val(jsonString);
		
	}
	MapMarker.prototype.importData = function() {
		var json = jQuery("#json_storage").val();
		if (json.length != 0) {
			data = jQuery.parseJSON(json);
		};
		
		
	}
	MapMarker.prototype.deleteDataById = function(id) {
		
		Array.prototype.remove = function(v) { this.splice(this.indexOf(v) == -1 ? this.length : this.indexOf(v), 1); }
		var deletable;
		for (var i = 0; i < data.length; i++) {
			if((data[i]).Id == id) {
				deletable = data[i];
				break;
			}
		};
		data.remove(deletable);
		jQuery("#"+id).remove();
		this.storeData();

		
	}
	MapMarker.prototype.refreshDialog = function(dialog,html) {
		dialog.html(html);
	}
	MapMarker.prototype.buildStandartMarker = function(x,y,id) {
		console.log(x,y);

		jQuery('<div></div>').appendTo(options.element).addClass(options.mapmarkerClass).css("left",x - 10).css("top",y - 10).attr("id",id).css("background-color","rgba(0, 235, 7, 0.1)").css("border","1px solid rgba(0, 235, 7, 1)").css("color","rgba(0, 235, 7, 1)");

		jQuery('<div></div>').appendTo(jQuery("#"+id)).addClass("markerTitle");
		
		
	}
	MapMarker.prototype.generateId = function() {
		var newId, unique;
		do {
			unique = true;
			newId = Math.floor((Math.random() * 9999) + 1);
			newId = "hs" + newId;
			for (var i = 0; i < data.length; i++) {
				if ( (data[i]).Id == newId) {
					unique = false;
					break;
				};
			};
		} while (1==2)
		return newId;
		
	}
	jQuery.fn.mapmarker = function (options) {
		new MapMarker(this, options);
		return this;
	}

}(jQuery));