var _args = arguments[0] || {};

var _percent="0";
var _isAnimationOn = true;
var defaultPercent = "50";
var defaultGaugeHeight = "25";

// Ti.API.info("_args.percent = "+_args.percent);

$.tiGaugeMeterVw.backgroundColor = _args.gaugeColor || "#4ba90a";
$.tiGaugeOverlayLbl.text = _args.overlayText || "";
$.tiGaugeOverlayLbl.color = _args.overlayTextColor || "white";
$.tiGaugeBGVw.backgroundColor =  _args.gaugeBGColor || "#e5e5e5";
$.tiGaugeBGVw.height = _args.gaugeHeight || defaultGaugeHeight;
$.tiGaugeMeterVw.height = _args.gaugeHeight || defaultGaugeHeight;
$.tiGaugeTitleLbl.text = _args.titleText || null;
$.tiGaugeTitleRightLbl.text = _args.titleRightText || null;
_isAnimationOn = _args.isAnimationOn || true;

$.setPercent = function (percent) {
	_percent = percent;
	
	$.tiGaugeMeterVw.right = "99%";
	
	if(_isAnimationOn && OS_IOS) {
		var animation = Titanium.UI.createAnimation();
		animation.right = (100-parseInt(percent)).toString()+"%";
		animation.duration = 1000;
		$.tiGaugeMeterVw.animate(animation);	
	} else {
		$.tiGaugeMeterVw.right = (100-parseInt(percent)).toString()+"%";
	}
	
	if($.tiGaugeTitleLbl.text || $.tiGaugeTitleRightLbl.text) {
		$.tiGaugeTitleVw.height=Ti.UI.SIZE;
	} else {
		$.tiGaugeTitleVw.height="0";
	}
};

$.getPercent = function () {
	return _percent;
};

$.setGaugeBackgroundColor = function (backgroundColor) {
	$.tiGaugeBGVw.backgroundColor = backgroundColor;
	$.setPercent(_percent);
};

$.getGaugeBackgroundColor = function () {
	return $.tiGaugeBGVw.backgroundColor;
};

$.setGaugeColor = function (backgroundColor) {
	$.tiGaugeMeterVw.backgroundColor = backgroundColor;
	$.setPercent(_percent);
};

$.getGaugeColor = function () {
	return $.tiGaugeMeterVw.backgroundColor;
};

$.setOverlayText = function (overlayText) {
	$.tiGaugeOverlayLbl.text = overlayText;
	$.setPercent(_percent);
};

$.clearOverlayText = function () {
	$.tiGaugeOverlayLbl.text = "";
	$.setPercent(_percent);
};

$.getOverlayText = function () {
	return $.tiGaugeOverlayLbl.text;
};

$.setOverlayTextColor = function (overlayTextColor) {
	$.tiGaugeOverlayLbl.color = overlayColor;
	$.setPercent(_percent);
};

$.getOverlayTextColor = function () {
	return $.tiGaugeOverlayLbl.color;
};

$.enableAnimation = function () {
	_isAnimationOn = true;
	$.setPercent(_percent);
};

$.disableAnimation = function () {
	_isAnimationOn = false;
	$.setPercent(_percent);
};

$.getAnimationSetting = function () {
	return _isAnimationOn;
};

$.setGaugeHeight = function (height) {
	$.tiGaugeBGVw.height = height;
	$.tiGaugeMeterVw.height = height;
	$.setPercent(_percent);
};

$.getGaugeHeight = function () {
	return $.tiGaugeBGVw.height;
};

$.setTitle = function (titleText) {
	$.tiGaugeTitleLbl.text = titleText;
	$.setPercent(_percent);
};

$.getTitle = function () {
	return $.tiGaugeTitleLbl.text;
};

$.clearTitle = function () {
	$.tiGaugeTitleLbl.text = null;
	$.setPercent(_percent);
};

$.setTitleRight = function (titleRightText) {
	$.tiGaugeTitleRightLbl.text = titleRightText;
	$.setPercent(_percent);
};

$.clearTitleRight = function () {
	$.tiGaugeTitleRightLbl.text = null;
	$.setPercent(_percent);
};

$.getTitleRight = function () {
	return $.tiGaugeTitleRightLbl.text;
};

if(_args.percent) {
	$.setPercent(_args.percent);
} else {
	$.setPercent(defaultPercent);
}