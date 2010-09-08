function init() {
	do_twitter_user();
	$("#about_tab").click(
		function(e) {
			if (!$("#about").is(":visible")) {
				var id = $("#nav > li > a.on").parent().attr("id").split("_")[0]; 
				$("#"+id).fadeOut("slow", function() {
					$("#about").fadeIn("slow");
				});
				$("#nav > li > a.on").removeClass("on");
				$("#about_tab > a").addClass("on");
			}
		}
	); 
	$("#meet_tab").click(
		function(e) {
			if (!$("#meet").is(":visible")) {
				var id = $("#nav > li > a.on").parent().attr("id").split("_")[0]; 
				$("#"+id).fadeOut("slow", function() {
					$("#meet").fadeIn("slow");
				});
				$("#nav > li > a.on").removeClass("on");
				$("#meet_tab > a").addClass("on");
			}
		}
	); 
	$("#contact_tab").click(
		function(e) {
			if (!$("#contact").is(":visible")) {
				var id = $("#nav > li > a.on").parent().attr("id").split("_")[0]; 
				$("#"+id).fadeOut("slow", function() {
					$("#contact").fadeIn("slow");
				});
				
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
			var weeks = $("#feed > ul > .week");
			for(var i = 0; i < data.length; i++) {
				var result = data[i];
				result.body = formatTwitString(result.text);
				var place = result.place;
				if ($(weeks[i]).length > 0) {
					var span = $("<span>"+result.body+"</span>");
					var a = span.find("a");
					if(a.length > 0 ) {
						var href = a.attr("href");
						$(weeks[i]).find("img").wrap("<a href='"+href+"'></a>")
					}
					$(weeks[i]).append(span);
				} else {
					$(weeks[i]).remove();
				}
				if(place != null) {
					getPlace($(weeks[i]), place)
				}
			}
			for(var i = data.length; i < 3; i++) {
				$(weeks[i]).remove();
			}
		},
		'error':function(request, status, error) {
			debug("Got an error going for the twitter timeline");
		},
		'dataType': 'jsonp'
	});
}

function getPlace(week, place) {
	$.jsonp({
			'url':place.url,
			'data': {},
			'timeout': 10000,
			'callbackParameter':"callback",
			'success': function(data, status) {					
				if(data.geometry) {
					if(data.geometry.coordinates) {
						var longitude = data.geometry.coordinates[0];
						var latitude = data.geometry.coordinates[1];
						var latlng = new google.maps.LatLng(latitude, longitude);
						var mapDiv = $("<div class='map'></div>");
						week.append(mapDiv);
						 var myOptions = {
							      zoom: 12,
							      center: latlng,
							      mapTypeId: google.maps.MapTypeId.ROADMAP
						}
						var map = new google.maps.Map(mapDiv[0], myOptions);
						 var marker = new google.maps.Marker({
					         map: map, 
					         position: latlng
					     });
//						week.append("<img src='http://maps.google.com/maps/api/staticmap?center="+latitude+","+longitude+"&zoom=15&size=200x200\
//&markers=color:blue|label:S|"+latitude+","+longitude+"&markers=size:tiny|color:green|Delta+Junction,AK\
//&markers=size:mid|color:0xFFFF00|label:C|Tok,AK&sensor=false' />");
						
					}
				}
			},
			'error':function(request, status, error) {
				debug("Got an error going for the twitter place api");
			}
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
