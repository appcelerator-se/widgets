var _args = arguments[0] || {};

var defaultColors = ["#00261C", "#168039", "#45BF55"];
var defaultData = [{"month": "1", "val": 2}, {"month": "2", "val": 2}, {"month": "3", "val": 3}, {"month": "4", "val": 4} , {"month": "5", "val": 5}];
var defaultNegativeColor = "red";
var defaultFontSize = 14;
var _fontSize = defaultFontSize;
var legendOn = false;
var spacersOn = false;

// Ti.API.info("_args.height = "+_args.height);
// Ti.API.info("_args.width = "+_args.width);
// Ti.API.info("_args.negativeColor = "+_args.negativeColor);
// Ti.API.info("_args.displayLegend = "+_args.displayLegend);
// Ti.API.info("_args.displaySpacers = "+_args.displaySpacers);
// Ti.API.info("_args.data = "+_args.data);

$.tiChartVw.height = _args.height || Ti.UI.FILL;
$.tiChartVw.width = _args.width || Ti.UI.FILL;
var negativeColor = _args.negativeColor || defaultNegativeColor;
// var colors = _args.colors || defaultColors;
var data = _args.data || defaultData;
var labelColor = _args.labelColor || "black";
var chartTitle = _args.chartTitle || null;

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

// Ti.API.info("$.tiChartVw.height = "+$.tiChartVw.height);
// Ti.API.info("$.tiChartVw.width = "+$.tiChartVw.width);
// Ti.API.info("negativeColor = "+negativeColor);
// Ti.API.info("legendOn = "+legendOn);
// Ti.API.info("spacersOn = "+spacersOn);

function clearChartView(){
	_.each($.barChartVw.children, function(view) {
		$.barChartVw.remove(view);
	});
	_.each($.barChartYLegendVw.children, function(view) {
		$.barChartYLegendVw.remove(view);
	});
	_.each($.barChartXLegendVw.children, function(view) {
		$.barChartXLegendVw.remove(view);
	});
};

$.setData = function (_data) {
	data = _data;
	// Ti.API.info("setData()");
	// Ti.API.info("data = "+data);
	
	var attrNameArray = [];
	var attrNameArrayIndex=0;
	
	for (var attrName in data[0]) {
	  // Ti.API.info("data attribute name = "+attrName);
	  attrNameArray[attrNameArrayIndex++] = attrName;
	}
	
	var maxVal = _.max(_.pluck(data, attrNameArray[1]));
	var minVal = _.min(_.pluck(data, attrNameArray[1]));
	var dataLen = data.length;
	var hasNegative = false;
	var rangeVal;
	
	clearChartView();
	
	// Ti.API.info("colors = "+colors);
	var colorIndex = 0;
	var numColors = colors.length;
	
	// Ti.API.info("length data = "+dataLen);
	// Ti.API.info("max data = "+maxVal);
	// Ti.API.info("min data = "+minVal);
	
	if(chartTitle) {
		$.chartTitleLbl.text = chartTitle;
		$.chartTitleLbl.height = Ti.UI.SIZE;
	} else {
		$.chartTitleLbl.text = null;
		$.chartTitleLbl.height = "0";
	}
	
	if(minVal<0) {
		// Ti.API.info("Has negative Vals");
		hasNegative = true;
		rangeVal = maxVal - minVal;
	} else {
		rangeVal = maxVal;
	}
	
	// Ti.API.info("range = "+rangeVal);
	
	// Ti.API.info("max data (after check) = "+maxVal);

	var barWidth = 100/dataLen;
	var barWidthFill = 0;
	
	if(spacersOn){
		barWidth = 100/((2*dataLen)-1);
	}
	
	// Ti.API.info("barWidth = "+barWidth);
	
	if(legendOn){
		$.barChartYLegendVw.width = "20%";
		$.barChartXLegendVw.height = "20%";
		$.barChartContVw.height = "80%";
	} else {
		$.barChartYLegendVw.width = "0%";
		$.barChartXLegendVw.height = "0%";
		$.barChartContVw.height = "100%";
	}
	
	for(var i=0;i<dataLen;i++)
	{
		var barHeight = 100*data[i][attrNameArray[1]]/rangeVal;
		
		// Ti.API.info("data{i}% = "+barHeight);
		
		// I have to do this to make sure there is enough space for the bars, otherwise, the last one or two are not shown
		// 5 was working well but maybe 2 is OK also as it helps the bars reach the RHS better
		if(i>dataLen-2){
			if(spacersOn){
				barWidth = (100/(2*dataLen)) - 1;
			} else {
				barWidth = (100/dataLen) - 1;	
			}
		}
		
		var barVw = Ti.UI.createView({
			width: spacersOn ? 1.2*barWidth.toString()+"%" : barWidth.toString()+"%",
			height: barHeight.toString()+"%",
			bottom: "0",
			backgroundColor: colors[(colorIndex++)%numColors],
			borderRadius: '2'
		});
		
		
		if(hasNegative){
			// Ti.API.info("Has negative check true");
			if(data[i][attrNameArray[1]]>=0){
				// Ti.API.info("Data val positive check true");
				barVw.bottom = (-100*minVal/rangeVal).toString()+"%";
			} else {
				// Ti.API.info("Data val positive check false");
				barVw.backgroundColor = negativeColor;
				barVw.bottom = (-100*(minVal-data[i][attrNameArray[1]])/rangeVal).toString()+"%";
				barVw.height = (-barHeight).toString()+"%";	
			}
		}
		
		// Ti.API.info("barVw.bottom = "+barVw.bottom);
		
		barWidthFill += barWidth;
		$.barChartVw.add(barVw);
		
		if((spacersOn) && (i<dataLen-1)) {
			var barSpacerVw = Ti.UI.createView({
				width: (80/100)*barWidth.toString()+"%",
				height: "0",
				bottom: "0",
				backgroundColor: "transparent"
			});
			$.barChartVw.add(barSpacerVw);	
		}
	}
	
	if(legendOn){
		var minYLbl = Alloy.createWidget('com.leorbrenman.tismallbarchart', 'axisLabel', {
			text: minVal,
			bottom: "0",
			right: "5",
			color: labelColor
		}).getView();
		
		var midYLbl = Alloy.createWidget('com.leorbrenman.tismallbarchart', 'axisLabel', {
			text: hasNegative ? "0" : maxVal/2,
			bottom: hasNegative ? (-100*minVal/rangeVal).toString()+"%" : "50%",
			right: "5",
			color: labelColor
		}).getView();
		
		var maxYLbl = Alloy.createWidget('com.leorbrenman.tismallbarchart', 'axisLabel', {
			text: maxVal,
			top: "0",
			right: "5",
			color: labelColor
		}).getView();
		
		$.barChartYLegendVw.add(minYLbl);
		$.barChartYLegendVw.add(maxYLbl);
		$.barChartYLegendVw.add(midYLbl);
		
		var minXLbl = Alloy.createWidget('com.leorbrenman.tismallbarchart', 'axisLabel', {
			text: data[0][attrNameArray[0]],
			top: "0",
			left: "5",
			color: labelColor
		}).getView();
		
		var maxXLbl = Alloy.createWidget('com.leorbrenman.tismallbarchart', 'axisLabel', {
			text: data[dataLen-1][attrNameArray[0]],
			top: "0",
			right: "5",
			color: labelColor
		}).getView();
		
		$.barChartXLegendVw.add(minXLbl);
		$.barChartXLegendVw.add(maxXLbl);
	}
	
	// Ti.API.info("TotalWidth% = "+barWidthFill);
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

$.setSpacersOnStatus = function (_spacersOnStatus) {
	// Ti.API.info("setSpacersOnStatus()");
	// Ti.API.info("_spacersOnStatus = "+_spacersOnStatus); 
	
	spacersOn = _spacersOnStatus;
	$.setData(data);
};

$.getSpacersOnStatus = function () {
	// Ti.API.info("getSpacersOnStatus()"); 
	
	return spacersOn;
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
	
	//colors = _colors;
	$.setData(data);
};

$.getColors = function () {
	// Ti.API.info("getColors()"); 
	
	return colors;
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

$.setNegativeColor = function (_negativeColor) {
	// Ti.API.info("setNegativeColor()");
	// Ti.API.info("_negativeColor = "+_negativeColor); 
	
	negativeColor = _negativeColor;
	$.setData(data);
};

$.getNegativeColor = function () {
	// Ti.API.info("getNegativeColor()"); 
	
	return negativeColor;
};

$.setSize = function (_height, _width) {
	// Ti.API.info("setSize()");
	// Ti.API.info("_height = "+_height);
	// Ti.API.info("_width = "+_width); 
	
	$.tiChartVw.height = _height;
	$.tiChartVw.width = _width;
	$.setData(data);
};

$.getSize = function () {
	// Ti.API.info("getSize()");

	var size = {height: $.tiChartVw.height, width: $.tiChartVw.width}; 
	return size;
};

$.setData(data);