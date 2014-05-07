/**
 * @class Widgets.grid
 *
 * The **Grid** widget provides a cross-platform grid of views that automatically lay themselves out in the view similar to the iOS native Dashboard control.
 *
 * ## Manifest
 * * Version: 1.0 (stable)
 * * Supported Platforms: iOS, Android, Mobile Web
 *
 * ## Adding the Grid Widget to Your Alloy Project
 *
 * In your application's config.json file you will want to include the following line in your dependencies:
 *
 *     "dependencies": {
 *         "com.appcelerator.grid":"1.0"
 *     }
 *
 * ### Creating a Local Copy
 * To create a copy local to your application so that you can further modify it, then you will need to:
 *
 * 1. Create a widgets directory in your app directory if it does not already exist.
 * 2. Copy the com.appcelerator.grid folder into your `app/widgets` directory.
 *
 * ## Create a Grid in the View
 *
 * You can add a Grid to a view by *requiring* the Grid widget.
 *
 *     <Widget id="grid" src="com.appcelerator.grid"/>
 *
 * Assign it an ID that you can use in your controller, for example, `id="grid"`.
 * You can now access the Grid using `$.grid` in your controller.
 *
 * ## Initializing the Grid in the Controller
 *
 * The grid does not have any items in it until you initialize it in your controller.
 * Before you open your window, you will want to call the grid with the `init` method. For example:
 *
 *     $.grid.init({
 *         items: [
 *              { id : '1', click: function (e) { alert("clicked!"); }, crossClick: function (e) { alert("cross clicked!"); }, backgroundImage : '/images/photo.png'},
 *              { id : '2'},
 *              { id : '3', click: function (e) { alert("clicked!"); }},
 *              { id : '4', click: function (e) { alert("clicked!"); }, crossClick: function (e) { alert("cross clicked!"); }},
 *              { id : '5', click: function (e) { alert("clicked!"); }, crossClick: function (e) { alert("cross clicked!"); }, backgroundImage : '/images/photo.png'},
 *              { id : '6', click: function (e) { alert("clicked!"); }, crossClick: function (e) { alert("cross clicked!"); }, backgroundColor : 'gray'},
 *         ],
 *         itemWidth: Alloy.isTablet ? 200: 100,
 *         itemHeight: Alloy.isTablet ? 200 : 100,
 *         backgroundColor: red,
 *         backgroundSelectedColor: brightred
 *     });
 *
 * ## Relaying out the Grid
 * If you ever have a need to relayout the Grid for a reason other than orientation (which is automatically supported), you can call the `relayout` method directly.
 *
 *     $.grid.relayout();
 *
 * The grid will calculate a new gutter between the items and animate the items into place one at a time.
 * **Note**: If you use autoLayout="true" (default) then a Ti.Gesture event handler will be used to relayout
 * the widget based on orientation changes. To avoid any potential memory leaks associated with using these
 * global event handlers, you must call the **destroy()** function on the widget when you are done using it.
 * This will free all memory resources associated with the widget. If you have autoLayout="false", then you are
 * not required to call **destroy()** when you are done with the widget.
 */

var TEXTSIZE = 10;

var defaults = {
    itemWidth : 50,
    itemHeight : 75,
    assetDir : '/images/' // Subdirectory to find the item assets.
};
/**
 * @method init
 * Initializes the item grid.
 * @param {Boolean} [autoLayout=true] If true, the widget will automatically adjust the layout for orientation events, which requires you to execute destroy() when you are done. if false, the widget does not adjust its layout automatically, and you are not required to call destroy() when finished using it.
 * @param {Array.<Object>} items The items array is an array of item objects each of which  describes an item to create in the grid.
 * @param {String} items.id Unique id for this item. This id also selects the image icons for this item. The Grid expects to find the image at app/assets/images/\<id\>.png.
 * @param {function(Object)} [items.click] The callback to call when the item is clicked. The function has an event parameter similar to that used for Titanium.UI.View.click. Overrides the global click callback, if any.
 * @param {function(Object)} [items.crossClick] The callback to call when the cross is clicked. The function has an event parameter similar to that used for Titanium.UI.View.click. Overrides the global click callback, if any.
 * @param {String} [items.backgroundColor=transparent] RGB triplet or named color to use as the background for the item. This overrides any Grid level backgroundColor.
 * @param {Number} itemWidth Width of a item in pixels.
 * @param {Number} itemHeight Height of a item in pixels.
 * @param {String} [backgroundColor=transparent] RGB triplet or named color to use as the background for the item. This can be overridden by item definition itself.
 * @param {String} [backgroundSelectedColor=transparent] RGB triplet or named color to use as the background for the item when it is selected. This can be overridden by item definition itself.
 * @param {Number} [duration=2000] Duration, in milliseconds, for the grid to animate when relaying out on orientation change.
 * @param {String} [assetDir='/images/'] Directory where assets for the item grid can be found.
 * @param {function(Object)} [click] The general callback to call when any item is clicked. The function has an event parameter similar to that used for Titanium.UI.View.click. Can be overridden by the individual item click callbacks.
 */
exports.init = function GridInit(args) {
    $._items = args.items;
    if (args.confirmationMessage != null && args.confirmationMessage != '') {
        $.confirmationMessage = args.confirmationMessage;
    }

    $._params = _.defaults(args, defaults);

    _.each($._items, function(item, index) {
        Ti.API.info('Grid: creating item ' + item.id);

        var itemProps = _.defaults(item, {
            center : {
                x : "50%",
                y : "50%"
            },
            borderRadius: 10,
            backgroundImage : $._params.assetDir + item.id + '.png',
            backgroundColor : $._params.backgroundColor || 'transparent',
            backgroundSelectedColor : $._params.backgroundSelectedColor || 'transparent',
            top: 10,
            right: 10,
            click : $._params.click
        });

        var crossProps = {
            right : 0,
            top : 0,
            height : 30,
            width : 30,
            bubbleParent : false,
            backgroundImage : "/images/tilecross.png"
        };

        // Create and add the item to the scroll view.
		$._items[index].b = Ti.UI.createView({
			width : $._params.itemWidth,
			height : $._params.itemHeight,
		});
		
		$._items[index].v = Ti.UI.createView(itemProps);
		$._items[index].b.add($._items[index].v); 
		
		$._items[index].c = Ti.UI.createView(crossProps);
		
        if (item.click) {
            $._items[index].v.addEventListener('singletap', function(e) {
                // Fixes a bug due to removing the title in iOS because
                // the text field cannot handle Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM
                // We still want this accessible to the click function, though.
                var source = _.clone(e.source);
                var temp = e.source;
                source.title = e.source.title || e.source._title;
                e.source = source;
                item.click(e);
                e.source = temp;
            });
        }

        if (item.crossClick) {
            $._items[index].b.add($._items[index].c);
            $._items[index].c.addEventListener('singletap', function(e) {
                Ti.API.info('Grid: deleting item ' + item.id);
                //If confirmationMessage message is not set, don't show the confirmation dialog and delete the item directly.
                if ($.confirmationMessage != null && $.confirmationMessage != '') {
                    //Dialog to take user confirmation prior deleting the selected document from briefcase.
                    var dialog = Ti.UI.createAlertDialog({
                        title : $.confirmationMessage,
                        buttonNames : ['Cancel', 'OK']
                    });
                    dialog.addEventListener('click', function(event) {
                        if (event.index == 1) {
                            $.deleteItem(item);
                        } else {
                            //Dialog Cancel event: Do nothing
                        }
                    });
                    dialog.show();
                } else {
                    //confirmationMessage not set
                    $.deleteItem(item);
                }

            });

        }

        $.scrollview.add($._items[index].b);
    });

    var autoLayout = $._params.autoLayout || typeof $._params.autoLayout === 'undefined';
    if (autoLayout) {
        Ti.Gesture.addEventListener("orientationchange", exports.relayout);
    }
    exports.relayout();
};

/**
 * @method deleteItem
 * Deletes the item from briefcase.
 * @param {Object} item Item to be deleted.
 */
$.deleteItem = function(item) {
    item.v.removeEventListener('singletap', item.click);
    $.scrollview.remove(item.b);

    //Finding the index of item from array to splice removed item element
    for (var i = 0; i < $._items.length; i++) {
        if ($._items[i].id === item.id) {
            item.crossClick({
                index : i,
                callback : function() {
                    $._items.splice(i, 1);
                }
            });
        }
    }
    item.b = null;

    //Re layout after deletion
    exports.relayout();
};

/**
 * @method destroy
 * Frees all resources associated with the item grid when done using it.
 * This function should be called when the item grid is no longer being
 * used to ensure that all memory allocated to it is released.
 */
exports.destroy = function() {
    Ti.Gesture.removeEventListener('orientationchange', exports.relayout);
    _.each($._items, function(item) {
        if (item.click) {
            item.v.removeEventListener('singletap', item.click);
        }
        $.scrollview.remove(item.b);
        item.b = null;
    });
};

/** Set the confirmation message **/
exports.setConfirmationMessage = function(message) {
    if (message != null && message != '') {
        $.confirmationMessage = message;
    }
};

/**
 * @method relayout
 * Redraws the items grid.
 * @param {Object} e Unused.
 */
exports.relayout = function GridRelayout(e) {
    Ti.API.info("Grid: relayout");
    var duration = $._params.duration || 2000;
    var contentWidth = Ti.Platform.displayCaps.getPlatformWidth() - 80;
    $.scrollview.contentWidth = contentWidth;
    $.scrollview.width = contentWidth;
    $.scrollview.contentHeight = "auto";

    // Calculate the new gutter.
    var w = contentWidth;
    var n = Math.floor(w / $._params.itemWidth);
    var gutter = (w - n * $._params.itemWidth) / (n + 1);
    var left = gutter, top = gutter;

	// Animate the items into place.
	_.each($._items, function(item) {
		//Orientation animation not working on android post SDK 3.1.3 GA.
		//Hence its checked and direct points are applied for android.
		if (OS_IOS) {
			item.b.animate({
				left : left,
				top : top,
				duration : duration
			});
		} else {
			item.b.left = left;
			item.b.top = top;
		}

		left += gutter + $._params.itemWidth;
		if (left >= w) {
			left = gutter;
			top += gutter + $._params.itemHeight;
		}
	}); 
};

exports.getItem = function(id) {
    for (var i in $._items) {
        if ($._items[i].id == id)
            return $._items[i].b;
    }

    return false;
};
