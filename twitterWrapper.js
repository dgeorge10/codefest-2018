var bot = require("./bot");

var twitterAPI = bot.getTwitterAPI();

class twitterWrapper {
	constructor() {
		this.twitterAPI = bot.getTwitterAPI();
		this.stream = this.twitterAPI.stream('statuses/filter', { track: 'traveltimetogo'})
	}

	autoFollowBack(sn){
		this.twitterAPI.post("friendships/create", {
		screen_name: sn,
	});
		console.log("Followed " + sn);
	}

	sendDM(sn, txt) {
		this.twitterAPI.post("direct_messages/new", {
		screen_name: sn,
		text: txt
		
	});
		console.log("it worked");
	}

	startStream(){
		var temp = this;
		this.stream.on('tweet', function (tweet) {
			var name = tweet.user.name;
			var screen_name = tweet.user.screen_name;
		 	temp.autoFollowBack(screen_name);
		 	var place = tweet.place.full_name;
			var geo = null;
			try{
				geo = tweet.geo.coordinates;
				
			}catch(e){
				temp.sendDM(screen_name, "Need to send tweet with precise location.");
			}
			console.log("Name: " + name + "\nScreen_Name: " + screen_name + "\nPlace: " + place);
			console.log(geo);
			
		});
	}

	autoFollowBack(sn){
		this.twitterAPI.post("friendships/create", {screen_name: sn}, function(err, response) {
			if (err) {
				console.log(err);
			} else {
				console.log("Followed " + sn);
			}
		});
	}

	sendDM(sn, txt) {
		this.twitterAPI.post("direct_messages/new", {
		screen_name: sn,
		text: txt
		
	});
		console.log("it worked");
	}
}

var boo = new twitterWrapper();
boo.startStream();

