var keys = require('./keys');
var fs = require("fs");
var geocoder = require('geocoder');

var taxifare = new Map();

var tempTax = JSON.parse(fs.readFileSync('./taxifare.json'));
for (i in tempTax) {
    taxifare.set(tempTax[i].CityName.split(',')[0].toLowerCase(), [tempTax[i].InitialCharge,tempTax[i].PerMileCharge]);
}

var Lyft = require('node-lyft');
var defaultClient = Lyft.ApiClient.instance;
//defaultClient.authentications['Client Authentication'].accessToken = keys.lyft.client_token;
let lyftAPI = new Lyft.PublicApi();

var Uber = require('node-uber')
const uber = new Uber({
    client_id: keys.uber.client_id,
    client_secret: keys.uber.client_secret,
    server_token: keys.uber.server_token,
    redirect_uri: '',
    name: 'twitterbot',
    language: 'en_US', // optional, defaults to en_US
    sandbox: true, // optional, defaults to false
});

street1 = '1500 Walnut Street';
city1 = 'Philadelphia';
zip1 = '19104';
state1 = 'PA';

street2 = '3300 Race Street';
city2 = 'Philadelphia';
zip2 = '19104';
state2 = 'PA';

isPool = '';


let startLat = 39.958467;
let startLng = -75.1919439;
let endLat = 39.9490881;
let endLng = -75.1683371;


if (street1!=null && city1!=null && zip1!=null && state1!=null) {
    geocoder.geocode(street1 + ', '+city1+', ' + state1+', ' + zip1, function (err, result) {
    	try{
	        console.log(result.results[0].geometry.location);
	        startLat = result.results[0].geometry.location.lat;
	        startLng = result.results[0].geometry.location.lng;
	        console.log(startLat + ' ' + startLng);
	     }catch(err){
	     	console.log('err');
	     }
    });
}
if (street2!=null && city2!=null && zip2!=null && state2!=null) {
    geocoder.geocode(street2 + ', '+city2+', ' + state2+', ' + zip2, function (err, result) {
    	try{
	        console.log(result.results[0].geometry.location);
	        endLat = result.results[0].geometry.location.lat;
	        endLng = result.results[0].geometry.location.lng;
	        console.log(endLat + ' ' + endLng);
	    }catch(err){
	    	console.log('fuck');
	    }

    });
}

//console.log(taxifare.get('newyork'));

let lowestCost = 100000000000;
let dName = 'Ayyyyy';
let rType = 'Ayyyyyyyy';
let spicyBoy = 'Me';

var uberPrices = [];
var lyftPrices = [];

uber.estimates.getPriceForRouteAsync(startLat,startLng,endLat,endLng,1).then((data) => {
    var costs = data.prices;
    for (x in costs) {
        var average = (costs[x].low_estimate+costs[x].high_estimate)/2;
        console.log(costs[x].localized_display_name + ': $' + parseFloat(average));
        //console.log("Cost: " + costs);
        if (costs[x].low_estimate!=null && average < lowestCost && !(costs[x].display_name == isPool)) {
            // uberPrices.push([costs[x].localized_display_name, parseFloat(average)]);
            lowestCost = average;
            dName = costs[x].display_name;
            rType = costs[x].localized_display_name;
            spicyBoy = 'Uber';
        }
    }
}, (error) => {
    console.log(error)
});



lyftAPI.getCost(startLat,startLng,{endLat:endLat,endLng:endLng}).then((data) => {
    var costs = data.cost_estimates;
    for (x in costs) {
        var average = (costs[x].estimated_cost_cents_min + costs[x].estimated_cost_cents_max) / 200;
        console.log(costs[x].ride_type + ': $' + parseFloat(average));
        if (costs[x].estimated_cost_cents_min!=null && average < lowestCost) {
     		// lyftPrices.push([costs[x].ride_type, parseFloat(average)]);
            lowestCost = average;
            dName = costs[x].display_name;
            rType = costs[x].ride_type;
            spicyBoy = 'Lyft';
        }
    }

console.log(uberPrices);
console.log(lyftPrices);

sorted = [];
while(uberPrices !== [] && lyftPrices !== []){
	if(uberPrices[i][1] > lyftPrices[j][1]){
		sorted.push(uberPrices.pop());
	}else{
		sorted.push(lyftPrices.pop());
	}
}
while(uberPrices !== []){
	sorted.push(uberPrices.pop());
}
while(lyftPrices !== []){
	sorted.push(lyftPrices.pop());
}

console.log(sorted); 	
    /*console.log('Lowest Price:');
    console.log(spicyBoy);
    console.log(rType);
    console.log(dName);
    console.log('Lowest Potential Price: ' + lowestCost);*/
}, (error) => {
    console.log(error)
});

var Twit = require('twit')
const twitter = new Twit({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token: keys.twitter.access_token,
    access_token_secret: keys.twitter.access_token_secret,
    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
});


/**
 var GoogleMapsAPI = require('googlemaps')
 const gmAPI = new GoogleMapsAPI({
    key: keys.google.key,
    stagger_time: 1000, // for elevationPath
    encode_polylines:   false,
    secure:             true // use https
});
 **/
