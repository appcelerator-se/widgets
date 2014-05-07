var _args = arguments[0] || {};

var defaultColors = ["#00261C", "#168039", "#45BF55"];
var defaultData = [{"month": "1", "val": 2}, {"month": "2", "val": 2}, {"month": "3", "val": 3}, {"month": "4", "val": 4} , {"month": "5", "val": 5}];
var defaultNegativeColor = "red";
var defaultFontSize = 14;
var _fontSize = defaultFontSize;

Ti.API.info("_args.height = "+_args.height);
Ti.API.info("_args.width = "+_args.width);
Ti.API.info("_args.negativeColor = "+_args.negativeColor);
Ti.API.info("_args.displayLegend = "+_args.displayLegend);
Ti.API.info("_args.displaySpacers = "+_args.displaySpacers);
Ti.API.info("_args.data = "+_args.data);

$.tiChartVw.height = _args.height || Ti.UI.FILL;
$.tiChartVw.width = _args.width || Ti.UI.FILL;
var negativeColor = _args.negativeColor || defaultNegativeColor;
var legendOn = _args.displayLegend || false;
var spacersOn = _args.displaySpacers || false;
var colors = _args.colors || defaultColors;
var data = _args.data || defaultData;
var labelColor = _args.labelColor || "black";

setData(data);

Ti.API.info("$.tiChartVw.height = "+$.tiChartVw.height);
Ti.API.info("$.tiChartVw.width = "+$.tiChartVw.width);
Ti.API.info("negativeColor = "+negativeColor);
Ti.API.info("legendOn = "+legendOn);
Ti.API.info("spacersOn = "+spacersOn);

$.setLegendOnStatus = function (_legendOnStatus) {
	Ti.API.info("setLegendOnStatus()");
	Ti.API.info("_legendOnStatus = "+_legendOnStatus); 
	
	legendOn = _legendOnStatus;
};

$.setColors = function (_colors) {
	Ti.API.info("setColors()");
	Ti.API.info("_colors = "+_colors); 
	
	colors = _colors;
};

$.setNegativeColor = function (_negativeColor) {
	Ti.API.info("setNegativeColor()");
	Ti.API.info("_negativeColor = "+_negativeColor); 
	
	negativeColor = _negativeColor;
};

$.setSize = function (_height, _width) {
	Ti.API.info("setSize()");
	Ti.API.info("_height = "+_height);
	Ti.API.info("_width = "+_width); 
	
	$.tiChartVw.height = _height;
	$.tiChartVw.width = _width;
};

function setData (data) {
	Ti.API.info("setData()");
	Ti.API.info("data = "+data);
	
	var attrNameArray = [];
	var attrNameArrayIndex=0;
	
	for (var attrName in data[0]) {
	  Ti.API.info("data attribute name = "+attrName);
	  attrNameArray[attrNameArrayIndex++] = attrName;
	}
	
	var maxVal = _.max(_.pluck(data, attrNameArray[1]));
	var minVal = _.min(_.pluck(data, attrNameArray[1]));
	var dataLen = data.length;
	var hasNegative = false;
	var rangeVal;
	
	_.each($.tiChartVw.children, function(view) {
		$.tiChartVw.remove(view);
	});
	
	Ti.API.info("colors = "+colors);
	//var colors = ["#00261C", "#168039", "#45BF55"];
	var colorIndex = 0;
	var numColors = colors.length;
	
	Ti.API.info("length data = "+dataLen);
	Ti.API.info("max data = "+maxVal);
	Ti.API.info("min data = "+minVal);
	
	if(minVal<0) {
		Ti.API.info("Has negative Vals");
		hasNegative = true;
		rangeVal = maxVal - minVal;
	} else {
		rangeVal = maxVal;
	}
	
	Ti.API.info("range = "+rangeVal);
	
	Ti.API.info("max data (after check) = "+maxVal);

	var barWidth = 100/dataLen;
	var barWidthFill = 0;
	
	if(spacersOn){
		barWidth = 100/((2*dataLen)-1);
	}
	
	Ti.API.info("barWidth = "+barWidth);
	
	var barChartVw = Ti.UI.createView({
		layout: "horizontal",
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
	});
	
	if(legendOn){
		var barChartContVw = Ti.UI.createView({
			layout: "horizontal",
			width: Ti.UI.FILL,
			height: "80%",
		});
		var barChartYLegendVw = Ti.UI.createView({
			width: "20%",
			height: Ti.UI.FILL,
		});
		var barChartXLegendVw = Ti.UI.createView({
			width: "80%",
			height: "20%",
			right: "0",
			top: "0"
		});
		
		barChartContVw.add(barChartYLegendVw);
		barChartContVw.add(barChartVw);
		$.tiChartVw.add(barChartContVw);
		$.tiChartVw.add(barChartXLegendVw);
		
	} else {
		$.tiChartVw.add(barChartVw);
	}
	
	for(var i=0;i<dataLen;i++)
	{
		//var barHeight = 100*data[i]/rangeVal;
		var barHeight = 100*data[i][attrNameArray[1]]/rangeVal;
		
		Ti.API.info("data{i}% = "+barHeight);
		
		if(i>dataLen-5){
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
			Ti.API.info("Has negative check true");
			if(data[i][attrNameArray[1]]>=0){
				Ti.API.info("Data val positive check true");
				barVw.bottom = (-100*minVal/rangeVal).toString()+"%";
			} else {
				Ti.API.info("Data val positive check false");
				barVw.backgroundColor = negativeColor;
				barVw.bottom = (-100*(minVal-data[i][attrNameArray[1]])/rangeVal).toString()+"%";
				barVw.height = (-barHeight).toString()+"%";	
			}
		}
		
		Ti.API.info("barVw.bottom = "+barVw.bottom);
		
		barWidthFill += barWidth;
		barChartVw.add(barVw);
		
		if((spacersOn) && (i<dataLen-1)) {
			var barSpacerVw = Ti.UI.createView({
				width: (80/100)*barWidth.toString()+"%",
				height: "0",
				bottom: "0",
				backgroundColor: "transparent"
			});
			barChartVw.add(barSpacerVw);	
		}
	}
	
	if(legendOn){
		var minYLbl = Ti.UI.createLabel({
			font: {fontSize: _fontSize},
			text: minVal,
			bottom: "0",
			right: "5",
			color: labelColor
		});
		
		var midYLbl = Ti.UI.createLabel({
			font: {fontSize: _fontSize},
			text: maxVal/2,
			bottom: "50%",
			right: "5",
			color: labelColor
		});
		
		if(hasNegative){
			midYLbl.bottom = (-100*minVal/rangeVal).toString()+"%";
			midYLbl.text = "0";
		}
		
		var maxYLbl = Ti.UI.createLabel({
			font: {fontSize: _fontSize},
			text: maxVal,
			top: "0",
			right: "5",
			color: labelColor
		});
		
		barChartYLegendVw.add(minYLbl);
		barChartYLegendVw.add(maxYLbl);
		barChartYLegendVw.add(midYLbl);
		
		var minXLbl = Ti.UI.createLabel({
			font: {fontSize: _fontSize},
			//text: "first",
			text: data[0][attrNameArray[0]],
			top: "0",
			left: "5",
			color: labelColor
		});
		
		var maxXLbl = Ti.UI.createLabel({
			font: {fontSize: _fontSize},
			//text: "last",
			text: data[dataLen-1][attrNameArray[0]],
			top: "0",
			right: "5",
			color: labelColor
		});
		
		barChartXLegendVw.add(minXLbl);
		barChartXLegendVw.add(maxXLbl);
	}
	
	Ti.API.info("TotalWidth% = "+barWidthFill);
};
exports.setData = setData;