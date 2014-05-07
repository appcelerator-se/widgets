var _args = arguments[0] || {};

var settings = {};
var actInd;
var actIndParent;

/**
 * Try to load Facebook Module
 */
var facebook = undefined;
try {
	facebook = require('facebook');
}
catch (e) {
Ti.API.info("Facebook module is not available.");
}

$.init = function(params) {
	settings.loginCallback = params.loginCallback;
	settings.remindCallback = params.remindCallback;
	settings.createCallback = params.createCallback;
	settings.allowFacebook = (params.facebookAppId && params.facebookPermissions) ? true : false;
 	settings.facebookAppId = params.facebookAppId || null;
 	settings.facebookPermissions = params.facebookPermissions || null;
 	
 	if(settings.facebookAppId){
 		facebook.appid = settings.facebookAppId;
 	}
 	if(settings.facebookPermissions){
 		facebook.permissions = settings.facebookPermissions;
 	} 
};

// Initialize based on passed in arguments, init can be called again if needed.
$.init(_args);

$.loginClick = function() {
  loginClick();
};

//Create activity indicator for buttons
function activityIndicator(){
	var style;
	if (OS_IOS){
	  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	}
	else {
	  style = Ti.UI.ActivityIndicatorStyle.DARK;
	}
	return Ti.UI.createActivityIndicator({
		color:"#ffffff",
	  	style:style,
	  	height:Ti.UI.SIZE,
	  	width:Ti.UI.SIZE
	});
	 
}

function loginClick() {
	if ($.usernameTxt.value && $.passwordTxt.value) {
		$.usernameTxt.blur();
		$.passwordTxt.blur();
		//$.loginLbl.text = "";
		if (!actInd) {
			actInd = activityIndicator();
		}

		$.loginBtn.add(actInd);
		actIndParent = 'loginBtn';
		actInd.show();
		
		settings.loginCallback && settings.loginCallback({
			username : $.usernameTxt.value,
			password : $.passwordTxt.value
		});
	} else {
		alert("Please provide your credentials.");
	}
}

function loginFacebook(e){
	
	$.facebookBtn.image = WPATH("/images/facebook-btn-loading.png");
	if(!actInd){
		actInd = activityIndicator();
	}
	$.facebookBtnWrapper.add(actInd);
	actIndParent = "facebookBtnWrapper";
	actInd.top =20;
	actInd.show();
	
	if(settings.allowFacebook && facebook){
		facebook.addEventListener('login', function(e) {
			if(e.success){
				 settings.loginCallback && settings.loginCallback({
	    			accessToken: facebook.accessToken,
	   				success: e.success
	   			 });
			}
		});
		
		facebook.authorize();
	}
}


//Hide the activity indicator placed on the login button.
$.hideActivityIndicator = function(){
   if(actInd != null){
       $[actIndParent].remove(actInd);
   } 
};

function forgotClick(e) {
	Ti.API.info('FORGOT CLICK');
	resetLoginForm();
	$.loginView.animate({ opacity:0.0, duration:250 }, function() {
		$.passworReminderView.visible = true;
		$.passworReminderView.animate({ opacity:1.0, duration:250 });
		OS_BLACKBERRY && ($.passworReminderView.opacity=1.0) && ($.passworReminderView.visible=true);
			
		$.loginContainer.height = 337;
	});
}

function remindClick(e) {
	if ($.emailTxt.value) {
		if(!actInd){
	      actInd = activityIndicator();  
	    }
		$.emailBtn.add(actInd);
		$.emailBtn.title = "";
		actIndParent = 'emailBtn';
		actInd.show();

		settings.remindCallback && settings.remindCallback();
	} else {
		alert("Please provide your email.");
	}
}

function cancelClick(e) {
	
	$.passworReminderView.animate({ opacity:0.0, duration:250 }, function() {
		$.passworReminderView.visible = false;
		$.loginView.animate({ opacity:1.0, duration:250 });
			
		OS_BLACKBERRY && ($.loginView.opacity=1.0) && ($.loginView.visible=true);
			
		$.loginContainer.height = 440; 
	});

	resetEmailForm();
}


function resetEmailForm(){
	$.emailTxt.value = '';
}

function resetAccountForm(){
	$.accountLbl.text = '';
	$.usernameNew.value = '';
	$.passwordNew.value = '';
	$.passwordConfirm.value = '';
}

function resetLoginForm(){
	$.usernameTxt.value = '';
	$.passwordTxt.value = '';
}

function focusStyle(evt){
	//evt.source.backgroundImage = WPATH("/images/field-bg-focused.png");
	
}

function blurStyle(evt){
	//evt.source.backgroundImage =  WPATH("/images/field-bg.png");
}

function focusPassword(){
    $.passwordTxt.focus();
}

Ti.App.addEventListener("keyboardframechanged",moveLoginContainer);

function moveLoginContainer(evt){
	if (Ti.App.keyboardVisible) {
		$.loginContainer.animate({
			center: {
				x: Ti.Platform.displayCaps.platformWidth / 2,
				// Accomodate status bar height on iPad...
				y: (Ti.Platform.osname === "ipad") ? ((Ti.Platform.displayCaps.platformHeight - evt.keyboardFrame.height) / 2) - 10 : ((Ti.Platform.displayCaps.platformHeight - evt.keyboardFrame.height) / 2)
			}, 
			duration: 250
		});
	} else{
		$.loginContainer.animate({
			center: {
				x: Ti.Platform.displayCaps.platformWidth / 2,
				y: Ti.Platform.displayCaps.platformHeight / 2
			},
			duration: 250
		});
	}
}

$.open = function(){
	
	$.wrapper.open();
	
	/* Check to see if we need to allow Facebook Button */
	if(settings.allowFacebook){
		$.facebookOptionView.visible = true;
	}
	

	if(OS_IOS){
		setTimeout(function() {
				// timeout only to delay initial animation (fake start)
				$.loginContainer.animate({
					height: settings.allowFacebook ? 500 : 440,
					duration: 250
				}, function() {
					$.loginView.animate({ opacity:1.0, duration:250 });
					//$.divider.animate({ opacity:1.0, duration: 250 });
					$.loginContainer.height = settings.allowFacebook ? 500 : 440;
				});
		}, 1000);
	} else {
		$.loginContainer.height  = settings.allowFacebook ? 500 : 440; 
		$.loginView.opacity = 1.0;
		//$.divider.opacity =1.0;
	}
	
	Ti.API.info($.loginContainer.height);
};

$.close = function(){
	
	Ti.App.removeEventListener("keyboardframechanged",moveLoginContainer);
	$.destroy();
	Alloy.CFG.skipLogin = false;
};

$.open();
