$(function() {
	function listenToKeys() {
		$(".url").on("keyup", function(e) {
			let url = $(this).val();

			if (e.keyCode == 13 && url.length >= 7) {
				let playback = $(this).parent().parent().find(".playback");

				let isNew;
				if(!playback.length) {
					playback = $("<iframe>").attr({
						class: "playback",
						frameborder: "0",
						allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					});
					$(this).parent().parent().find(".no-playback").remove();
					$(this).parent().parent().append(playback);

					isNew == true
				}

				let video = youtube_video(url);
				let playlist = youtube_playlist(url);

				let currentVideo = youtube_video(playback.attr("src") || "") || (playback.attr("src") || "").substr(-7);
				let currentPlaylist = youtube_playlist(playback.attr("src") || "");


				if(isNew || video != currentVideo || playlist != currentPlaylist) {
					if(video && playlist) {
						playback.attr("src", "https://www.youtube.com/embed?v="+video+"&list="+playlist);
					}
					else if(video) {
						playback.attr("src", "https://www.youtube.com/embed/"+video);
					}
					else if(playlist) {
						playback.attr("src", "https://www.youtube.com/embed?list="+playlist);
					}

					if($(this).parent().attr("id") == "first") {
						$.get("https://www.youtube.com/live_chat?v="+video+"&list="+playlist+"&embed_domain=joogps.github.io").done(function() {
							if($("#first-row").find("#chat").length)
								$("#first-row").find("#chat").attr("src", "https://www.youtube.com/live_chat?v="+video+"&embed_domain=joogps.github.io");
							else
								$("#first-row").append($("<td>").addId("chat").attr("rowspan", $(".frame").length));
						})
					}
				}
			}
		});
	};

	listenToKeys();

	$("#edit > button").click(function() {
		let url = $(this).parent().parent().find(".url");
		let playback = $(this).parent().parent().parent().find(".playback");

		let video = youtube_video(url.val());
		let playlist = youtube_playlist(url.val());

		let currentVideo = youtube_video(playback.attr("src") || "") || (playback.attr("src") || "").substr(-7);
		let currentPlaylist = youtube_playlist(playback.attr("src") || "");


		if(video != currentVideo || playlist != currentPlaylist) {
			let event = jQuery.Event("keyup");
			event.which = event.keyCode = 13
			url.trigger(event)
		}

		if(playback.attr("src")) {
			let playback = $("<div>").addClass("no-playback");
			let url = $("<input>").addClass("url").attr("placeholder", "Video URL goes here");
			let controller = $("<div>").addClass("controller").append(url);
			let tableData = $("<td>").addClass("frame").append(controller).append(playback);
			let tableRow = $("<tr>").append(tableData);

			$("table").append(tableRow);

			listenToKeys();
		}
	});
});

function youtube_video(url) {
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	return (match && match[7].length==11)? match[7] : false;
}

function youtube_playlist(url) {
	var regExp = /^.*((youtu.be\/)|list=([^#\&\?]+))/;
	var match = url.match(regExp);
	return (match && match[3].length==34)? match[3] : false;
}