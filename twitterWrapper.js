var bot = require("./bot");

var twitterAPI = bot.getTwitterAPI();

class twitterWrapper {
	constructor() {
		this.twitterAPI = bot.getTwitterAPI();
		console.log(this.twitterAPI);
	}
}

var boo = new twitterWrapper();



// twitterWrapper.prototype.getMentionName= function() {
// 	var mentions = this.twitterAPI.get('statuses/mentions_timeline', { since_id: this.lastID }, function (err, data, response){
// 		this.lastID = data.id_str;
// 		console.log(data);	
// 	});
	
// }