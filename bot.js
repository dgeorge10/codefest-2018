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

//asks the user if they would like to order uber or lyft
getUserPreference = function(data){
    var userStream = twitter.stream('user');
    setTimeout(function(){
        userStream.stop();
    },180000);//3 minutes
    userStream.on('direct_message', function(message){
        if(message.direct_message.sender.screen_name == data.screen_name){
            console.log("Message received from: " + data.screen_name + "\n\tmsg: " + message.direct_message.text);
            if(message.direct_message.text.toLowerCase().trim() == 'uber'){
                sendDM(data.screen_name, uberWrapper.getLink(data));
                userStream.stop();
            }else if(message.direct_message.text.toLowerCase().trim() == 'lyft'){
                sendDM(data.screen_name, lyftWrapper.getLink(data));
                userStream.stop();
            }else{
             userStream.stop();   
            }
            console.log("Completed preference");
        }
    });
}



//Ask where the user would like to go and call the get cost function to give them useful information
getUserLocation = function(screen_name, geo){
	console.log("Entered getUserLocation with user: " + screen_name);
    var userStream = twitter.stream('user');
    setTimeout(function(){
        userStream.stop();
        console.log("Closed getUserLocation Stream with " + screen_name + " due to timeout");
    },600000);
    userStream.on('direct_message', function(message){
        if(message.direct_message.sender.screen_name == screen_name){
			console.log("Message received from: " + screen_name + "\n\tmsg: " + message.direct_message.text);
            getCosts(newData(geo[0], geo[1], screen_name, message.direct_message.text), userStream);
            userStream.stop();
			console.log("Completed " + screen_name + "\ngeo: " + geo[0] + "," + geo[1]);
		}
	});
}

//sorts the price data from most expensive to least expensive so when you print it is in the correct order visually
function sort(data, callback){
    var uberCopy = data.uberPrice.splice(0,data.uberPrice.length-1);
    var lyftCopy = data.lyftPrice;
    var taxiCopy = data.taxiPrice;
    var sortedPrice = mergeSortedLists(mergeSortedLists(uberCopy,lyftCopy),taxiCopy);
    
    sortedPrice.reverse();
    //console.log(sortedPrice);
    var outText = "";
    for(x in sortedPrice){
        outText += sortedPrice[x].toString().replace(",",": $").replace("_"," ") + "\r\n";
    }
    outText += "Would you like to use Uber or Lyft?"
    //console.log(outText);
    callback(data,outText);
}

//merges two sorted lists to maintain sort
function mergeSortedLists(list1, list2) {
    var sortedList = []
    var i = 0;
    var j = 0;
    while(i <= list1.length-1 && j <= list2.length-1){
        if(list1[i][1] <= list2[j][1]){
            sortedList.push(list1[i]);
            i++;
        }else{
            sortedList.push(list2[j]);
            j++;
        }
    }
    while(i <= list1.length-1){
        sortedList.push(list1[i]);
        i++;
    }
    while(j <= list2.length-1){
        sortedList.push(list2[j]);
        j++;
    }
    return sortedList;
}

//a lot of callbacks to be sure everything runs in order.
function getCosts(data, userStream) {
    geoWrapper.geolocate(data, function(data) {
        lyftWrapper.getCost(data, function(data) {
            uberWrapper.getCost(data, function(data){
                taxiWrapper.getCost(data, taxiFare, function(data) {
                    sort(data,function(data, text, callback = function(data){getUserPreference(data);}){
                        setTimeout(function(name = data.screen_name,t=text){sendDM(name, text)}, 1000);
                        callback(data);
                    });
                });
            });
        });
    });
}

//allows wrappers to access api instances
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

//sends a dm to a user based on screen name
sendDM = function(sn, txt) {
    getTwitterAPI().post("direct_messages/new", {
        screen_name: sn,
        text: txt
    });
    console.log("DM sent to: " + sn);
    console.log("\tmsg: " +txt);
}

//starts the twitter listening stream which waits until we get mentioned in a tweet then calls appropriate functions
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
            sendDM(screen_name, "Hello! Welcome to traveltimetogo bot.\r\nWhere would you like to go?");
            getUserLocation(screen_name, geo);      
        }catch(e){
            console.log(e);
            if(geo == null){
                sendDM(screen_name, "Need to send tweet with precise location.");    
            }
        }
    });
}

//if we do not follow user follow them so they can dm us
autoFollowBack = function(sn){
    getTwitterAPI().post("friendships/create", {screen_name: sn}, function(err, response) {
        if (err) {
            console.log(err);
        }else if(response.following == true){
        	console.log('Already following ' + sn);
        }
        else{
            console.log("Followed " + sn);
        }
    });
}

//data structure so that we do not have to pass each piece individually
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

//starts the program
startStream();

