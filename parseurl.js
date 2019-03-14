function youtube_video(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	return (match&&match[7].length==11)? match[7] : false;
}

function youtube_playlist(url){
	var regExp = /^.*((youtu.be\/)|list=([^#\&\?]+))/;
	var match = url.match(regExp);
	return (match&&match[3].length==34)? match[3] : false;
}