var bot = require("./bot");
var keys = require("./keys")

exports.getCost = function(data, callback){
	console.log("Entered uberWrapper");
	bot.getUberAPI().estimates.getPriceForRouteAsync(data.startLat,data.startLng,data.endLat,data.endLng,data.seats).then((dat) => {
	var costs = dat.prices;
	miles = costs[0].distance;
	var uberPrices = [];
	for (x in costs) {
	    var average = (costs[x].low_estimate+costs[x].high_estimate)/2;
	    //console.log(costs[x].localized_display_name + ': $' + parseFloat(average));
	    //console.log("Cost: " + costs);
	    if (costs[x].low_estimate!=null) {
	        uberPrices.push([costs[x].localized_display_name, parseFloat(average)]);
	        dName = costs[x].display_name;
	        rType = costs[x].localized_display_name;
	        spicyBoy = 'Uber';
	    }
	}
	data.uberPrice = uberPrices;
	data.miles = miles;
	callback(data);
	}, (error) => {
	console.log(error)
	});
}

exports.getLink = function(data){
	var link = 'https://m.uber.com/ul/?action=setPickup&client_id='+keys.uber.client_id+'&pickup=my_location&dropoff[nickname]=dropoff2C%20USA&dropoff[latitude]='+data.endLat+'&dropoff[longitude]='+data.endLng;
	//console.log(link);
	return link;
}