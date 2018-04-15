var bot = require("./bot");



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
