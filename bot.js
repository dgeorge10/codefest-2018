var keys = require('./keys');
var fs = require("fs");

var taxiFare = new Map();
var tempTax = JSON.parse(fs.readFileSync('./taxifare.json'));
for (i in tempTax) {
    taxiFare.set(tempTax[i].CityName.split(',')[0].toLowerCase(), [tempTax[i].InitialCharge,tempTax[i].PerMileCharge]);
}

var Lyft = require('node-lyft');
var defaultClient = Lyft.ApiClient.instance;
defaultClient.authentications['Client Authentication'].accessToken = keys.lyft.client_token
const lyft = new Lyft.PublicApi();


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


var Twit = require('twit')
const twitter = new Twit({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token: keys.twitter.access_token,
    access_token_secret: keys.twitter.access_token_secret,
    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
});


getUserLocation = function(screen_name, geo){
	console.log("Entered getUserLocation with user: " + screen_name);
    var userStream = twitter.stream('user');
    setTimeout(function(){
        userStream.close();
    },600000);
    userStream.on('direct_message', function(message){
        if(message.direct_message.sender.screen_name == screen_name){
			console.log(message);
            getCosts(newData(geo[0], geo[1], screen_name, message.direct_message.text), userStream);
			console.log("Completed " + screen_name + "\ngeo: " + geo[0] + "," + geo[1]);
		}
	})
}


function sort(data, callback){
    var uberCopy = data.uberPrice.splice(0,data.uberPrice.length-1);
    var lyftCopy = data.lyftPrice;
    var sortedPrice = [];
    var i = 0;
    var j = 0;
    while(i <= uberCopy.length-1 && j <= lyftCopy.length-1){
        if(uberCopy[i][1] <= lyftCopy[j][1]){
            sortedPrice.push(uberCopy[i]);
            i++;
        }else{
            sortedPrice.push(lyftCopy[j]);
            j++;
        }
    }
    while(i <= uberCopy.length-1){
        sortedPrice.push(uberCopy[i]);
        i++;
    }
    while(j <= lyftCopy.length-1){
        sortedPrice.push(lyftCopy[j]);
        j++;
    }
    sortedPrice.reverse();
    var outText = "";
    for(x in sortedPrice){
        outText += sortedPrice[x].toString().replace(",",": $").replace("_"," ") + "\r\n";
    }
    console.log(outText);
    callback(data,outText);
}

function getCosts(data, userStream) {
    geoWrapper.geolocate(data, function(data) {
        lyftWrapper.getCost(data, function(data) {
            uberWrapper.getCost(data, function(data){
                taxiWrapper.getCost(data, taxiFare, function(data) {
                    sort(data,function(data, text, callback = function(userStream){
                        userStream.stop();
                    }){
                        sendDM(data.screen_name, text);
                        callback(userStream);
                    });
                });
            });
        });
    });
}

module.exports = {
    getLyftAPI: function(){
        return lyft
    },

    getUberAPI: function(){
        return uber;
    }
}
getTwitterAPI = function() {
	return twitter;
}

var geoWrapper = require("./geoWrapper");
var taxiWrapper = require("./taxiWrapper");
var uberWrapper = require("./uberWrapper");
var lyftWrapper = require("./lyftWrapper");

sendDM = function(sn, txt) {
    getTwitterAPI().post("direct_messages/new", {
        screen_name: sn,
        text: txt
    });
    console.log("DM sent to: " + sn);
    console.log("\tmsg: " +txt);
}

var geoWrapper = require("./geoWrapper");
var taxiWrapper = require("./taxiWrapper");
var uberWrapper = require("./uberWrapper");
var lyftWrapper = require("./lyftWrapper");

startStream = function(){
    console.log("Entered startStream");
    twitter.stream('statuses/filter',{track:'traveltimetogo'}).on('tweet', function (tweet) {
        var name = tweet.user.name;
        var screen_name = tweet.user.screen_name;
        autoFollowBack(screen_name);
        var geo = null;
        console.log("Received tweet");
        try{
            geo = tweet.geo.coordinates;
            sendDM(screen_name, "Where would you like to go?");
            getUserLocation(screen_name, geo);      
        }catch(e){
            console.log(e);
            if(geo == null){
                sendDM(screen_name, "Need to send tweet with precise location.");    
            }
        }
    });
}

autoFollowBack = function(sn){
    getTwitterAPI().post("friendships/create", {screen_name: sn}, function(err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log("Followed " + sn);
        }
    });
}

function newData (startLat,startLng,screen_name, address, seats=1){
    var data = {};

    data.startLat = startLat;
    data.startLng = startLng;
    data.screen_name =  screen_name;
    data.seats = seats;
    data.address = address;

    data.endLng = null;
    data.endLat = null;
    data.uberPrice = [];
    data.lyftPrice = [];
    data.taxiPrice = [];

    data.print = function(){
        return "startLat: " + data.startLat + "\nstartLng:" + data.startLng + "\nscreen_name:" + screen_name + "\nseats: " + seats;
    };

    return data;
}

data = newData(39.958467,-75.1919439, 'dsbuddy27', "Rittenhouse Square Philadelphia PA");
getCosts(data);

startStream();

