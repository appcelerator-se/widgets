/**
 * This is customized ListView leveraging a high quality UI design allowing for complex swiping gestures and multiple interface points.
 * 
 * @class productList
 * @widget com.appcelerator.ui.listview
 */

/**
 * stores arguments passed into the view on creation
 */
var _args = arguments[0] || {};

/**
 * Sections of the ListView
 * 
 * @Array
 * @private
 */
var _sections = [];

/**
 * Items associated with the ListView
 * 
 * @Array
 * @private
 */
var _items = [];

/**
 * Slides the detailview out of the picture
 * 
 * @private
 * @param {Object} _evt The javascript object passed by the event
 */
function onListItemTouchMove(_evt){ 
	
	
	
	if(OS_IOS){
		Ti.API.info(JSON.stringify(_evt));
		
		var left = Math.round(_evt.source.convertPointToView({x:_evt.x,y:_evt.y},_evt.source.parent).x);
		_evt.source.left = left > 0 ? left : 0;
			
		//TODO - Need to move animations into a lib or functional mixin
		var hiddenLbl = _evt.source.parent.children[0].children[0]; 
		if((_evt.source.left > 100) && hiddenLbl.text === "Slide >"){
			hiddenLbl.animate({
				opacity: 0.0,
				duration: 125
			}, function(){
				hiddenLbl.text = "Release +";
					hiddenLbl.animate({
					opacity: 1.0,
					duration: 125
				});
			}) ;
		}
		else if((_evt.source.left < 100) && hiddenLbl.text !== "Slide >"){
			hiddenLbl.animate({
				opacity: 0.0,
				duration: 125
			}, function(){
				hiddenLbl.text = "Slide >";
					hiddenLbl.animate({
					opacity: 1.0,
					duration: 110
				});
			}) ;
		}
		hiddenLbl.left = left-125;
		_evt.cancelBubble=true;
	}
	
}

function onListItemTouchMoveAndroid(_evt){
	Ti.API.info(JSON.stringify(_evt.source.apiName));
	Ti.API.info(JSON.stringify(_evt.source.id));
	var left = _evt.x;
	
	( _evt.source.children[1].id == "detailView" ) && (_evt.source.children[1].left = left > 0 ? left : 0);
	
}

/**
 * Callback function for the `touchend` on each List Item. Checks position of the detailview and either slides it back
 * into original position OR pushes it out of the way and closes the list Item
 * 
 * @private
 * @param {Object} _evt - _evt The javascript object passed by the event
 */
function onListItemTouchEnd(_evt){  
	
	if(_evt.source.left > 100){	
		//TODO - Need to move animations into a lib or functional mixin
		var hiddenLbl = _evt.source.parent.children[0].children[0];
		hiddenLbl.animate({
			opacity: 0.0,
			duration: 125
		}, function(){
			hiddenLbl.applyProperties({
				text: "You have added it!",
				width: Ti.UI.FILL,
				left: 0,
				textAlign: "center"
			});
			hiddenLbl.animate({
				opacity: 1.0,
				duration: 125,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT 
			});
		}) ; 
		
		/**
		 * Animation to move the detailView out of the way
		 */
		_evt.source.animate({ 
			left: _evt.source.width,
			duration: 250,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT  
		}, function(){
			
			Ti.API.info('[NEW LEFT] - '+_evt.source.left);
			/**
			 * brief timeout to allow for the background message to be seen/noticed
			 */
			setTimeout(function(){
				
				/**
				 * After the timeout, lets fade out the ListItem view as a whole before we remove it
				 */
				_evt.source.parent.parent.animate({
					opacity: 0.0,
					duration: 250,
					curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT 
				}, function(){
					
					/**
					 * All done, remove the ListItem from the ListSection/ListView
					 */
					var section = $.wrapper.sections[_evt.sectionIndex];
					section.deleteItemsAt(_evt.itemIndex, 1, false);
				});
			}, 250);
		});
		
	} else {
		
		/**
		 * Else Statement accounts for a pop-back effect
		 */
		_evt.source.animate({ 
			left: 0,
			duration: 250,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT 
		});
	};
}

/**
 * Slides the top layer of the ListView over to the right and fades it out before
 * removing it
 * @param {Object} _evt - object passed in by event handler
 */
function onButtonClick(_evt){

	Ti.API.info(JSON.stringify(_evt));

	if(OS_IOS && _evt.source.parent){	
		
		//TODO - Need to move animations into a lib or functional mixin
		var hiddenLbl = _evt.source.parent.parent.children[0].children[0]; 
		hiddenLbl.applyProperties({
			text: "You have added it!",
			left:0,
			width:Ti.UI.FILL,
			textAlign: "center"
		});
			
		_evt.source.parent.width = 220;
		_evt.source.parent.animate({ 
			left: 220,
			duration: 250 
		}, function(){
			_evt.source.parent.parent.parent.animate({
				opacity: 0.0,
				duration: 500
			},function(){
				var section = $.wrapper.sections[_evt.sectionIndex];
				section.deleteItemsAt(_evt.itemIndex, 1, false);
			});
			
		});
	} 
};

/**
 * Handled any associated callback for clicking on the icon
 * 
 * @param	{object} _evt - the event object passed by the triggering object.
 * @private
 */
function onIconClick(_evt){
	Ti.API.info('addItListView::[ICON CLICK EVENT] - '+JSON.stringify(_evt));
	_args.iconClickCallback && _args.iconClickCallback(_evt);
}

/**
 * 
 */

/** 
 * Add a new list item to the ListView
 *
 * @param {array}  _item - array of ListItem parameters
 * @param {integer} _section - (optional) Index of the section to which you want to add the item. Defaults to 0.
 * @public
 */
function addItems(_items, _section){
	/**
	 * Default to 0 if no section index is specified
	 */
	_section = _section || 0; 
	
	/**
	 * Make sure that items is a valid array and then add item(s) to the specified section
	 */ 
	//_items && _items.length && $.wrapper.sections[_section].insertItemsAt($.wrapper.sections[_section].items.length, _items, false);
	_items && _items.length && $.wrapper.sections[_section].insertItemsAt(0,_items);
}
$.addItems = addItems;



/**
 * Public method to handle orientation if this controller
 * is opened via {@link core#openScreen} or if
 * {@link core#bindOrientationEvents} is applied to this controller
 * @param {Object} _event
 */
$.handleOrientation = function(_event) {
	Ti.API.debug(_event.orientation);
};