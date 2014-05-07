var args = arguments[0] || {};



function onClickLikeButton(_evt){
	
	_evt.source.isLiked ? (_evt.source.image = WPATH("/images/likebtn.png")) : (_evt.source.image = WPATH("/images/likebtnOn.png"));
	
};
