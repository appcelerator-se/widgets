/**
 * JS Libs 
 */
var moment = require('alloy/moment');

/**
 * Passed In Arguments
 */
var _args = arguments[0] || {};
 

$.init = function init(_timelineObject){
	var footerView = Alloy.createWidget("com.appcelerator.timeline", "timeLineSection", {fillColor: "#a9a9a9"}).getView();
	$.tableView.footerView = footerView;


	var sections = [];

	var todayHv = Alloy.createWidget("com.appcelerator.timeline", "timeLineSection", {text: "Today", fillColor: "#dcdcdc"}).getView();
	var todaySection = Ti.UI.createTableViewSection({
		headerView:todayHv
	});
	todaySection.add(Alloy.createWidget("com.appcelerator.timeline", "timeLineRow" ).getView());
	todaySection.add(Alloy.createWidget("com.appcelerator.timeline", "timeLineRow").getView());
	sections.push(todaySection);


	for(var i=0;i<=5;i++){
		var hv = Alloy.createWidget("com.appcelerator.timeline", "timeLineSection", {text: "Day+"+i}).getView();
		var section = Ti.UI.createTableViewSection({
			headerView:hv
		});
		
		section.add(Alloy.createWidget("com.appcelerator.timeline", "timeLineRow", {label: "FILE"}).getView());
		section.add(Alloy.createWidget("com.appcelerator.timeline", "timeLineRow", {label: "TASK"}).getView());
		section.add(Alloy.createWidget("com.appcelerator.timeline", "timeLineRow", {label: "REPLY"}).getView());
		
		sections.push(section);
	}
	$.tableView.data = sections;


	setTimeout($.addItem, 5000);
};

/**
 * Adds an item to the timeline
 * @param {Object} _item - an item object consists of properties for TIMESTAMP, a LABEL type, an ICON type
 */
$.addItem = function addItem(_item){
	alert('Add Item');

	$.tableView.touchEnabled = false;
	$.tableView.visible = false;
	$.snapshot.image = $.tableView.toImage();
	$.snapshot.visible = true;
	$.loading.visible = true;

	setTimeout(function(e){
		alert("Done Loading");
		$.snapshot.image = null;
		$.snapshot.visible = false;
		$.loading.visible = false;
		$.tableView.visible = true;
		$.tableView.touchEnabled = true;
	},3000);
	//TODO Add an item to the data set

	// Validate Item properties

	// Add Item to Array

	// Take current Image snapshot of TableView

	// Show Snapshot View

	// Show Loading View

	// Sort Array

	// Rebuild TableView

	// Hide Snapshot

	// Hide Loading View
	
};

/**
 * Removes a particular item from the Timeline based on the row index of the item
 * @param {Integer} _index
 */
$.removeItem = function removeItem(_index){
	// TODO remove an item
};

/**
 * Additionally another way to build the timeline is to do a full JSON import
 * @param {Object} _json
 */
$.createFromJSON = function createFromJSON(_json){
	
	//TODO Import Data into Timeline from JSON Object
};

$.init();

