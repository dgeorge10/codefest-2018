var bot = require("./bot");

var twitterAPI = bot.getTwitterAPI();

class twitterWrapper {
	constructor() {
		this.twitterAPI = bot.getTwitterAPI();
		var stream = this.twitterAPI.stream('statuses/filter', { track: 'traveltimetogo'})

		stream.on('tweet', function (tweet) {
			console.log(tweet);
		});
	}

	// constructor() {
	// 	this.twitterAPI = bot.getTwitterAPI();
	// 	this.lastID = this.twitterAPI.get('statuses/mentions_timeline', { since_id: this.lastID }, function (err, data, response){
	// 		return data[0].user.id_str;
	// 	});
	// }

	// getMentionName() {
	// 	var mentions = this.twitterAPI.get('statuses/mentions_timeline', { since_id: this.lastID }, function (err, data, response){
	// 		try{
	// 			this.lastID = data[0].user.id_str;
	// 			console.log(data);
	// 		}
					
	// 	});
	// }
}

var boo = new twitterWrapper();

