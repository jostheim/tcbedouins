function init() {
	do_twitter_user();
	$("#about_tab").click(
		function(e) {
			if (!$("#about").is(":visible")) {
				var id = $("#nav > li > a.on").parent().attr("id").split("_")[0]; 
				$("#"+id).fadeOut("slow");
				$("#about").fadeIn("slow").addClass("on");
				$("#nav > li > a.on").removeClass("on");
				$("#about_tab > a").addClass("on");
			}
		}
	); 
	$("#meet_tab").click(
		function(e) {
			if (!$("#meet").is(":visible")) {
				var id = $("#nav > li > a.on").parent().attr("id").split("_")[0]; 
				$("#"+id).fadeOut("slow");
				$("#meet").fadeIn("slow");
				$("#nav > li > a.on").removeClass("on");
				$("#meet_tab > a").addClass("on");
			}
		}
	); 
	$("#contact_tab").click(
		function(e) {
			if (!$("#contact").is(":visible")) {
				var id = $("#nav > li > a.on").parent().attr("id").split("_")[0]; 
				$("#contact").fadeIn("slow").addClass("on");
				$("#"+id).fadeOut("slow");
				$("#nav > li > a.on").removeClass("on");
				$("#contact_tab > a").addClass("on");
			}
		}
	); 
	
}

function do_twitter_user() {
	var url = "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=tc_bedouins_sch&lang=en&count=3&page=1";
	// Setting its src to the search API URL; We provide TweetTick as a callback
	$.jsonp({
		'url': url,
		'data': {},
		'timeout': 10000,
		'callbackParameter': "callback",
		'success': function(data, status) {
			for(var i = 0; i < data.length; i++) {
				var result = data[i];
				result.body = formatTwitString(result.text);
				if ($("#feed > ul > .week" + (i + 1)).length > 0) {
					$("#feed > ul > .week" + (i + 1)).html(result.body);
				} else {
					$("#feed > ul > .week"+(i+1)).remove();
				}
			}
			for(var i = data.length; i < 3; i++) {
				$("#feed > ul > .week"+(i+1)).remove();
			}
		},
		'error':function(request, status, error) {
			debug("Got an error going for the twitter timeline");
		},
		'dataType': 'jsonp'
	});
}

function formatTwitString(str) {
	// This function formats the tweet body text

	str=' '+str;

	str = str.replace(/((ftp|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
	// The tweets arrive as plain text, so we replace all the textual URLs with hyperlinks

	str = str.replace(/([^\w])\@([\w\-]+)/gm,'$1@<a href="http://twitter.com/$2" target="_blank">$2</a>');
	// Replace the mentions

	str = str.replace(/([^\w])\#([\w\-]+)/gm,'$1<a href="http://twitter.com/search?q=%23$2" target="_blank">#$2</a>');
	// Replace the hashtags

	return str;
}
