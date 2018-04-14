var bot = require("./bot");

var twitterAPI = bot.getTwitterAPI();

class twitterWrapper {
	constructor() {
		this.twitterAPI = bot.getTwitterAPI();
		this.stream = this.twitterAPI.stream('statuses/filter', { track: 'traveltimetogo'})
	}

	startStream(){
		this.stream.on('tweet', function (tweet) {
			var name = tweet.user.name;
			var screen_name = tweet.user.screen_name;
		 	var place = tweet.place.full_name;
			var geo = tweet.geo.coordinates;
			console.log("Name: " + name + "\nScreen_Name: " + screen_name + "\nPlace: " + place);
			console.log(geo);
		});
	}

	autoFollowBack(){
		
	}
}




var boo = new twitterWrapper();
boo.startStream();
