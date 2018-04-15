var bot = require('./bot');

getCost = function(startLat,startLng,endLat,endLng,callback, seats=1){
	lyftAPI.getCost(startLat,startLng,{endLat:endLat,endLng:endLng}).then((data) => {
	    var costs = data.cost_estimates;
	    var lyftPrices = [];
	    for (x in costs) {
	        var average = (costs[x].estimated_cost_cents_min + costs[x].estimated_cost_cents_max) / 200;
	        console.log(costs[x].ride_type + ': $' + parseFloat(average));
	        if (costs[x].estimated_cost_cents_min!=null && average < lowestCost) {
	     		lyftPrices.push([costs[x].ride_type, parseFloat(average)]);
	            lowestCost = average;
	            dName = costs[x].display_name;
	            rType = costs[x].ride_type;
	            spicyBoy = 'Lyft';
	        }
	    }
	    callback(lyftPrices);
	}, (error) => {
    console.log(error)
	});

}