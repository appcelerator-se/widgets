var _args = arguments[0] || {};

var defaultColors = ["#1d90c7", "#f8a300", "#7ab700", "#8382be", "#da510b", "#273e81", "#31A6A8", "#F3AD14", "#597533", "#435C6F", "#EF6960", "#2667C1"];
var defaultData = [{"type": "Equities", "val": 40}, {"type": "Fixed Income", "val": 5}, {"type": "Cash & Eq", "val": 25}, {"type": "Bonds", "val": 20}, {"type": "Alternates", "val": 20}, {"type": "Securities", "val": 5}];
var defaultFontSize = 14;
var _fontSize = defaultFontSize;
var legendOn = true;

// Ti.API.info("_args.height = "+_args.height);
// Ti.API.info("_args.width = "+_args.width);
// Ti.API.info("_args.displayLegend = "+_args.displayLegend);
// Ti.API.info("_args.data = "+_args.data);
// Ti.API.info("_args.labelColor = "+_args.labelColor);

$.chartVw.height = _args.height || Ti.UI.FILL;
$.chartVw.width = _args.width || Ti.UI.FILL;
var data = _args.data || defaultData;
var labelColor = _args.labelColor || "black";
var chartTitle = _args.chartTitle || null;
var chartTitleColor = _args.chartTitleColor || "black";

var colors;

// process color as string or array of strings
if(_args.colors) {
	if(typeof _args.colors === "string") {
		colors = [_args.colors];
	}  else {
		colors = _args.colors;
	}
} else {
	colors = defaultColors;
}

// Ti.API.info("$.chartVw.height = "+$.chartVw.height);
// Ti.API.info("$.chartVw.width = "+$.chartVw.width);
// Ti.API.info("legendOn = "+legendOn);

function clearChartView(){
	_.each($.barChartVw.children, function(view) {
		$.barChartVw.remove(view);
	});
	_.each($.chartLegendLeftVw.children, function(view) {
		$.chartLegendLeftVw.remove(view);
	});
	_.each($.chartLegendRightVw.children, function(view) {
		$.chartLegendRightVw.remove(view);
	});
};

$.setData = function (_data) {
	data = _data;
	// Ti.API.info("setData()");
	// Ti.API.info("data = "+data);
	
	if(legendOn){
		$.chartLegendVw.height = "65%";
		$.barChartVw.height = "25%";
	} else {
		$.chartLegendVw.height = "0%";
		$.barChartVw.height = "90%";
	}

	var attrNameArray = [];
	var attrNameArrayIndex=0;
	
	for (var attrName in data[0]) {
	  // Ti.API.info("data attribute name = "+attrName);
	  attrNameArray[attrNameArrayIndex++] = attrName;
	}
	
	var dataLen = data.length;
	var dataSum = 0;
	var dataArray = [];
	
	for(var j=0;j<dataLen;j++) {
		dataArray[j] = data[j][attrNameArray[1]];
		dataSum += dataArray[j]; 
	}
	
	clearChartView();
	
	// Ti.API.info("colors = "+colors);
	var colorIndex = 0;
	var numColors = colors.length;
	
	// Ti.API.info("length data = "+dataLen);
	// Ti.API.info("length datanumber of colors = "+numColors);
	
	if(chartTitle) {
		$.chartTitleLbl.text = chartTitle;
		$.chartTitleLbl.height = Ti.UI.SIZE;
		$.chartTitleLbl.color = chartTitleColor;
		$.chartVw.top="10";
	} else {
		$.chartTitleLbl.text = null;
		$.chartTitleLbl.height = "0";
		$.chartVw.top="0";
	}
	
	for(var i=0;i<dataLen;i++)
	{
		// var barWidth = data[i][attrNameArray[1]]+"%";
		var barWidth = (100*dataArray[i]/dataSum)+"%";
		
		// Ti.API.info("data["+i+"]% = "+barWidth);
		
		var barVw = Ti.UI.createView({
			width: barWidth,
			height: Ti.UI.FILL,
			backgroundColor: colors[(colorIndex++)%numColors],
		});
		
		
		// first bar starts on the left
		if(i===0) {
			barVw.left = 0;
		}
		
		// last bar fills remaining space
		if(i=== (dataLen-1)) {
			barVw.width = Ti.UI.FILL;
		}
	
		$.barChartVw.add(barVw);
		
		if(legendOn){
			var legendLbl = Alloy.createWidget('com.leorbrenman.tistackbar', 'legendItem', {
				text: data[i][attrNameArray[0]] + " ("+(100*dataArray[i]/dataSum).toPrecision(2) +"%)",
				labelColor: labelColor,
				legendMarkerColor: barVw.getBackgroundColor()
			}).getView();
						
			if(i<dataLen/2) {
				$.chartLegendLeftVw.add(legendLbl);
			} else {
				$.chartLegendRightVw.add(legendLbl);
			}
		}
	}
};

$.setLegendOnStatus = function (_legendOnStatus) {
	// Ti.API.info("setLegendOnStatus()");
	// Ti.API.info("_legendOnStatus = "+_legendOnStatus); 
	
	legendOn = _legendOnStatus;
	$.setData(data);
};

$.getLegendOnStatus = function () {
	// Ti.API.info("getLegendOnStatus()"); 
	
	return legendOn;
};

$.setColors = function (_colors) {
	// Ti.API.info("setColors()");
	// Ti.API.info("_colors = "+_colors); 
	
	// process color as string or array of strings
	if(_colors) {
		if(typeof _colors === "string") {
			colors = [_colors];
		}  else {
			colors = _colors;
		}
	} else {
		colors = defaultColors;
	}
	
	$.setData(data);
};

$.getColors = function () {
	// Ti.API.info("getColors()"); 
	
	return colors;
};

$.setChartLabelColor = function (_color) {
	// Ti.API.info("setChartLabelColor()");
	// Ti.API.info("_color = "+_color); 
	
	labelColor = _color;
	$.setData(data);
};

$.getChartLabelColor = function () {
	// Ti.API.info("getChartLabelColor()"); 
	
	return labelColor;
};

$.setChartTitleColor = function (_color) {
	// Ti.API.info("setChartTitleColor()");
	// Ti.API.info("_color = "+_color); 
	
	chartTitleColor = _color;
	$.setData(data);
};

$.getChartTitleColor = function () {
	// Ti.API.info("getChartTitleColor()"); 
	
	return chartTitleColor;
};

$.setChartTitle = function (_title) {
	// Ti.API.info("setChartTitle()");
	// Ti.API.info("_title = "+_title); 
	
	chartTitle = _title;
	$.setData(data);
};

$.getChartTitle = function () {
	// Ti.API.info("getChartTitle()"); 
	
	return chartTitle;
};

$.clearChartTitle = function () {
	// Ti.API.info("clearChartTitle()"); 
	
	chartTitle = null;
	$.setData(data);
};

$.setSize = function (_height, _width) {
	// Ti.API.info("setSize()");
	// Ti.API.info("_height = "+_height);
	// Ti.API.info("_width = "+_width); 
	
	$.chartVw.height = _height;
	$.chartVw.width = _width;
	$.setData(data);
};

$.getSize = function () {
	// Ti.API.info("getSize()");

	var size = {height: $.tiChartVw.height, width: $.tiChartVw.width}; 
	return size;
};

$.setData(data);