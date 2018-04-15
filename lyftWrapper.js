var bot = require('./bot');

exports.getCost = function(data, callback){
	console.log("Entered lyftWrapper");
	bot.getLyftAPI().getCost(data.startLat,data.startLng,{endLat:data.endLat,endLng:data.endLng}).then((dat) => {
	    var costs = dat.cost_estimates;
	    var lyftPrices = [];
	    for (x in costs) {
	        var average = (costs[x].estimated_cost_cents_min + costs[x].estimated_cost_cents_max) / 200;
	        console.log(costs[x].ride_type + ': $' + parseFloat(average));
	        if (costs[x].estimated_cost_cents_min!=null && average < lowestCost) {
	     		lyftPrices.push([costs[x].ride_type, parseFloat(average)]);
	        }
	    }
	    data.lyftPrices = lyftPrices;
	    callback(data);
	}, (error) => {
    console.log(error)
	});

}