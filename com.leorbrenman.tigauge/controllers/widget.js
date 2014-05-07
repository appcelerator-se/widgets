var _args = arguments[0] || {};

Ti.API.info("_args.percent = "+_args.percent);

_args.percent ? $.tiGaugeMeterVw.right = (100-parseInt(_args.percent)).toString()+"%" : $.tiGaugeMeterVw.right = "50%";

$.tiGaugeMeterVw.backgroundColor = _args.gaugeColor || "#4ba90a";
$.tiGaugeOverlayLbl.text = _args.overlayText || $.tiGaugeMeterVw.right;
$.tiGaugeOverlayLbl.color = _args.overlayTextColor || "white";
$.tiGaugeBGVw.backgroundColor =  _args.gaugeBGColor || "#e5e5e5";

$.setPercent = function (percent) {
	$.tiGaugeMeterVw.right = (100-parseInt(percent)).toString()+"%";
};

$.setGaugeBackgroundColor = function (backgroundColor) {
	$.tiGaugeBGVw.backgroundColor = backgroundColor;
};

$.setGaugeColor = function (backgroundColor) {
	$.tiGaugeMeterVw.backgroundColor = backgroundColor;
};

$.setOverlayText = function (overlayText) {
	$.tiGaugeOverlayLbl.text = overlayText;
};

$.setOverlayTextColor = function (overlayTextColor) {
	$.tiGaugeOverlayLbl.color = overlayColor;
};