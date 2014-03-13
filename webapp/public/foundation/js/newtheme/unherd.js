$(document).ready(function(){ 
	
	FnLoadTweets();
	
	$("#TwBtn").click(function(){
		
		var tweet = $("#TweetText").val();
				
		$.post("/ajaxTweet", {"tweet":tweet,"replyto":""}, function( data ) {
			
			$("#TweetText").val("");
			$("#composer").removeClass('open').css({"top": "4px",
"left": "-99999px"});
			  
		});	
		
	});

	//$("#RcBtn").click(function(){
		
		//$("#recommendBox").hide();	
		//$("#normalBox").show();
		//var recommendto = $("#ForwardTo").val();
		//var custommsg = $("#RecText").val();
		//var tweet = $("#ForwTweet").val();
		
		
		//$.post("/ajaxRecommend", {"tweet_id":tweet,"forward_to": recommendto,"custom_msg":custommsg}, function( data ) {
			
			//console.log(data);
			//$("#RecText").val("");
			//$("#ForwardTo").val("");
			//$("#tweetbox").slideUp('fast');
			//$(".tweetCloudIcon").removeClass("cloudup");
			  
		//});	
		
	//});


	
	$(".content_type").click(function() {

		var el = $(this).data("id");	
		$(".tweetsclass").hide();
		$(".type-"+el).show();			
		
	});
	
	
		
});


function FnLoadTweets() {
	
	$.get( "/ranktweet", function( tweets ) {
		
		var tophtml = "";
		var chatterhtml = "";
		var tweetSection = "";
		
		/**percent calculation**/
		var max_score = 1;
		if(typeof(tweets)!="undefined" && typeof(tweets[0])!="undefined" ) {
			
			max_score =  parseFloat(tweets[0].score).toFixed(2);

		}		
		/**percent calculation**/
	

	  	for(i=0; i<tweets.length;i++) {
			
			var tweet = tweets[i];

				
			var retweeted = "",favorited = "",statRT="false",statFV="false",RTtext="Retweet";
			if(tweet.favorited!=false) {
				favorited = " activeAction";
				statFV="true";
			}
			if(tweet.retweeted!=false) {
				retweeted = " activeAction";
				RTtext="Retweeted"
				statRT="true";
			}
			
			tweet.text = linkify_entities(tweet);
			
			tweet_class="topnews";
			
			if(i<=tweets.length/2) {
				tweet_class="type-topstories";
			} else {
				tweet_class="type-chatter";
			}
			
			tweetSection += '<li class="large-24 small-24 no-Pg columns optimize tweetsclass '+tweet_class+'">';
			tweetSection += '<article class="tweetBox clearfix">';
			if(tweet.isNew == true) {
				tweetSection += '<span class="newAlert"></span>';
			}
			tweetSection += '<div class="large-3 small-3 columns no-Pg"><img src="'+tweet.user.profile_image_url_https+'" alt="'+tweet.user.name+'" class="radius"> </div>';
			tweetSection += '<div class="large-16 small-16 columns"><h1><a href="">'+tweet.user.name+'</a> </h1><h2><a href="">@'+tweet.user.screen_name+' </a> <span>| '+FnTimeAgo(tweet.created_at)+'</span></h2></div>';
			
			tweetSection += '<div class="large-5 small-5 columns"><div class="rankBox">';
			tweetSection += '<div class="progress success round"><span  data-tooltip  class = "has-tip tip-top"  title = "'+parseFloat(tweet.score).toFixed(2)+'" >';

		    var percent = 	(parseFloat(tweet.score).toFixed(2))*100/max_score;			

			tweetSection += '<span class="meter" style="width: '+percent.toFixed(0)+'%"></span> </span>';
			tweetSection += '</div></div></div>';
			
			tweetSection += '<div class="large-24 small-24 columns no-Pg">';
			tweetSection += '<div class="content">';
			if(typeof(tweet.retweeted_status)!="undefined" && typeof(tweet.retweeted_status.entities)!="undefined" && typeof(tweet.retweeted_status.entities.media)!="undefined" && typeof(tweet.retweeted_status.entities.media[0])!="undefined" && typeof(tweet.retweeted_status.entities.media[0].media_url_https)!="undefined") {
				tweetSection += '<div class="large-24 columns media text-center"><img src="'+tweet.retweeted_status.entities.media[0].media_url_https+'" alt="" /></div>';
				tweetSection += '<div class="large-24 columns">';
            }
            tweetSection += '<p>'+tweet.text+'</p>';
            if(typeof(tweet.retweeted_status)!="undefined" && typeof(tweet.retweeted_status.entities)!="undefined" && typeof(tweet.retweeted_status.entities.media)!="undefined" && typeof(tweet.retweeted_status.entities.media[0])!="undefined" && typeof(tweet.retweeted_status.entities.media[0].media_url_https)!="undefined") {
			    tweetSection += '</div>'
            }
            tweetSection += '</div></div>';
            
            
            tweetSection += '<div class="large-24 columns"><div class="tweetAction"><ul class="inline-list right no-Mn-Bm hoverEffect">';
			tweetSection += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statRT+'" class="BtnRT'+retweeted+'" href="javascript: void(0)" title="Retweet"><i class="fa fa-retweet"></i> '+tweet.retweet_count+'</a></li>';
			tweetSection += '<li><a data-tid="'+tweet.id_str+'" data-stat="'+statFV+'" class="BtnFv'+favorited+'" href="javascript: void(0)" title="Favourite"><i class="fa fa-star"></i> '+tweet.favorite_count+'</a></li>';
			tweetSection += '<li><a class="BtnRP" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'" href="javascript: void(0)" title="Reply"><i class="fa fa-reply"></i> </a></li>';
			tweetSection += '<li><a class="BtnFW" data-tid="'+tweet.id_str+'" data-user="'+tweet.user.screen_name+'" href="javascript: void(0)" title="Forward"><i class="fa fa-mail-forward"></i> </a></li>';
			tweetSection += '</ul></div></div></article></li>';
						
			
			
					
		}
		
		$("#mainSection").html(tweetSection);
		$(".type-chatter").hide();	
		
	
		$(".BtnRT").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  var stat = $( this ).data("stat");
		  console.log("RT",stat,tid);
		  var el = $( this );
		  if(stat!="true") {
			  $.post( "/ajaxRetweet", {"tid":tid,"stat":stat}, function( tweets ) {
				
				el.addClass("activeAction");
				el.data("stat","true");
				//FnLoadTweets();
				  
			  });
		  }			
			
		});

		$(".BtnFv").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  var stat = $( this ).data("stat");
		  console.log("FV",tid);
		  var el = $( this );
		  $.post( "/ajaxFavourite", {"tid":tid,"stat":stat}, function( tweets ) {
			
			if(stat!="true") {
				el.addClass("activeAction");
				el.data("stat","true");
			} else {
				el.removeClass("activeAction");
				el.data("stat","false");	
			}
			//FnLoadTweets();
			  
		  });

		});

		$(".BtnRP").on("click", function() {
		  
		  $("#recommendBox").hide();	
		  $("#normalBox").show(); 
		  var tid = $( this ).data("tid");
		  var user = $( this ).data("user");
		  $("#TweetText").val("@"+user);
		  $("#ReplyTo").val(tid);
		  $("#tweetbox").slideDown('fast');
		  $(".tweetCloudIcon").addClass("cloudup");	  

		});
	
		$(".BtnFW").on("click", function() {
		  
		  var tid = $( this ).data("tid");
		  $("#recommendBox").show();	
		  $("#ForwTweet").val(tid);
		  $("#normalBox").hide(); 
		  $("#tweetbox").slideDown('fast');
		  $(".tweetCloudIcon").addClass("cloudup");	  

		});
			
		
	});
	
	
	
}



function FnTimeAgo(time){
	
	var units = [
	{ name: "s", limit: 60, in_seconds: 1 },
	{ name: "m", limit: 3600, in_seconds: 60 },
	{ name: "h", limit: 86400, in_seconds: 3600  },
	{ name: "year", limit: null, in_seconds: 31556926 }
	];
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var olddate = new Date(time);
	var diff = (new Date() - olddate) / 1000;
	if (diff < 5) return "now";

	var i = 0;
	while (unit = units[i++]) {
		if (diff < unit.limit || !unit.limit){
			if(!unit.limit) {
				return monthNames[olddate.getMonth()]+" "+olddate.getDate();
			} else {
				var diff =  Math.floor(diff / unit.in_seconds);
				return diff + "" + unit.name + (diff>1 ? "" : "");
			}
		}
	};
}

var followers = new Bloodhound({
	datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	limit: 10,
	prefetch: {
		url: '/api/followers',
		filter: function(list) {
			return $.map(list, function(follower) { return { name: '@'+follower }; });
		}
	}
});
followers.initialize();
$('.typeahead').typeahead(null, {
	name: 'followers',
	displayKey: 'name',
	source: followers.ttAdapter()
});