var bot = require("./bot");
var keys = require("./keys")

exports.getCost = function(data, callback){
	console.log("Entered lyftWrapper");
	var lyft = bot.getLyftAPI();
	lyft.getCost(data.startLat,data.startLng,{endLat:data.endLat,endLng:data.endLng}).then((dat) => {
	    var costs = dat.cost_estimates;
	    var lyftPrices = [];
	    for (x in costs) {
	        var average = (costs[x].estimated_cost_cents_min + costs[x].estimated_cost_cents_max) / 200;
	        //console.log(costs[x].ride_type + ': $' + parseFloat(average));
	        if (costs[x].estimated_cost_cents_min!=null) {
	     		lyftPrices.push([costs[x].ride_type, parseFloat(average)]);
	        }
	    }
	    data.lyftPrice = lyftPrices;
	    callback(data);
	}, (error) => {
    console.log(error)
	});

}

exports.getLink = function(data){
	var link = 'https://lyft.com/ride?id=lyft&pickup[latitude]='+ data.endLat +'&pickup[longitude]='+ data.endLng + '&partner=' + keys.lyft.client_id;
	//console.log(link);
	return link;
}