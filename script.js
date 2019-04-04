$(function() {
	function listenToURL() {
		$(".url").on("keyup", function(e) {
			if (e.keyCode == 13)
				playback($(this));
		});
	};

	function listenToEdit() {
		$(".edit > button").click(function() {
			edit($(this));
		});
	}

	function playback(url) {
		if (url.val().length >= 7) {
			let playback = url.parent().parent().find(".playback");

			let isNew;
			if(!playback.length) {
				playback = $("<iframe>").attr({
					class: "playback",
					frameborder: "0",
					allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				});
				url.parent().parent().find(".no-playback").remove();
				url.parent().parent().append(playback);

				isNew == true;
			}

			let video = youtube_video(url.val());
			let playlist = youtube_playlist(url.val());

			let currentVideo = youtube_video(playback.attr("src") || "") || (playback.attr("src") || "").substr(-7);
			let currentPlaylist = youtube_playlist(playback.attr("src") || "");


			if(isNew || video != currentVideo || playlist != currentPlaylist) {
				let params = "autoplay=1&color=white&modestbranding=1&rel=0&fs=0&origin=https://joogps.github.io/";

				if(video && playlist)
					playback.attr("src", "https://www.youtube.com/embed?v="+video+"&list="+playlist+"&"+params);
				else if(video)
					playback.attr("src", "https://www.youtube.com/embed/"+video+"?"+params);
				else if(playlist)
					playback.attr("src", "https://www.youtube.com/embed?list="+playlist+"&"+params);

				url_exists("https://www.youtube.com/live_chat?v="+video+"&embed_domain=joogps.github.io", function(){
					if($("tr").first().find(".chat").length)
						$("tr").first().find(".chat").attr("src", "https://www.youtube.com/live_chat?v="+video+"&embed_domain=joogps.github.io");
					else
						$("tr").first().append($("<td>").attr("rowspan", $(".frame").length).append($("<iframe>").addClass("chat").attr("src", "https://www.youtube.com/live_chat?v="+video+"&embed_domain=joogps.github.io")));
				})
			}
		}
	}

	function edit(button) {
		let url = button.closest(".controller").find(".url");
		let playback = url.closest(".frame").find(".playback");

		let video = youtube_video(url.val());
		let playlist = youtube_playlist(url.val());

		let currentVideo = youtube_video(playback.attr("src") || "") || (playback.attr("src") || "").substr(-7);
		let currentPlaylist = youtube_playlist(playback.attr("src") || "");

		if(video != currentVideo || playlist != currentPlaylist)
			playback(url)
		else {
			if(button.hasClass("add")) {
				if(playback.attr("src")) {
					let playback = $("<div>").addClass("no-playback");
					let url = $("<input>").addClass("url").attr("placeholder", "Video URL goes here");
					let remove = $("<button>").addClass("remove").html("-");
					let add = $("<button>").addClass("add").html("+");
					let edit = $("<div>").addClass("edit").append(remove).append(add);
					let controller = $("<div>").addClass("controller can-edit").append(url).append(edit);
					let tableData = $("<td>").addClass("frame").append(controller).append(playback);
					let tableRow = $("<tr>").append(tableData);

					button.closest(".controller").removeClass("can-edit");
					button.parent().remove();

					$("table").append(tableRow);
				}
				else
					url.focus();

				listenToURL();
				listenToEdit();
			}
			else if(button.hasClass("remove")) {
				if($(".frame").length > 1) {
					let remove = $("<button>").addClass("remove").html("-");
					let add = $("<button>").addClass("add").html("+");
					let edit = $("<div>").addClass("edit").append(remove).append(add);

					button.closest("tr").prev().find("td").find(".controller").addClass("can-edit").append(edit);
					button.closest("tr").remove();
				}
				else 
					url.focus();

				listenToURL();
				listenToEdit();
			}
		}
	}

	listenToURL();
	listenToEdit();

	$(".no-playback > img").click(function() {
		$(".url").first().focus();
	})
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

function url_exists(url, callback){
	$.ajax({
		type: 'HEAD',
		url: url,
		success: function(){
			callback(true);
		},
		error: function() {
			callback(false);
		}
	});
}