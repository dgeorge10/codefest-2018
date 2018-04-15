var bot = require("./bot");
var keys = require("./keys")

getPrice = function(startLat,startLng,endLat,endLng,callback, seats=1){
	uber.estimates.getPriceForRouteAsync(startLat,startLng,endLat,endLng,seats).then((data) => {
	var costs = data.prices;
	miles = costs[0].distance;
	var uberPrices = [];
	for (x in costs) {
	    var average = (costs[x].low_estimate+costs[x].high_estimate)/2;
	    console.log(costs[x].localized_display_name + ': $' + parseFloat(average));
	    //console.log("Cost: " + costs);
	    if (costs[x].low_estimate!=null && average < lowestCost && !(costs[x].display_name == isPool)) {
	        uberPrices.push([costs[x].localized_display_name, parseFloat(average)]);
	        lowestCost = average;
	        dName = costs[x].display_name;
	        rType = costs[x].localized_display_name;
	        spicyBoy = 'Uber';
	    }
	}
	callback(uberPrices);
	}, (error) => {
	console.log(error)
	});
}

exports.getLink = function(data){
	var link = 'https://m.uber.com/ul/?action=setPickup&client_id='+keys.uber_client_id+'&pickup=my_location&dropoff[nickname]=dropoff2C%20USA&dropoff[latitude]='+data.endlat+'&dropoff[longitude]='+data.endLng;
	console.log(link);
	return link;
}