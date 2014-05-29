var _args = arguments[0] || {};

//Ti.API.info("_args.text = "+_args.text);

$.legendLbl.text = _args.text || null;
$.legendLbl.color = _args.labelColor || "black";
$.legendMarkerVw.backgroundColor =  _args.legendMarkerColor || "black"; 