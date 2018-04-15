var keys = require('./keys')

var Lyft = require('node-lyft')
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

 var GoogleMapsAPI = require('googlemaps')
 const gmAPI = new GoogleMapsAPI({
    key: keys.google.key,
    stagger_time: 1000, // for elevationPath
    encode_polylines:   false,
    secure:             true // use https
});

var Twit = require('twit')
const twitter = new Twit({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token: keys.twitter.access_token,
    access_token_secret: keys.twitter.access_token_secret,
    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
});

var getUserLocation = function(screen_name, geo){
	var userStream = twitter.stream('user');
	userStream.on('direct_message', function(message){
		if(message.direct_message.sender.screen_name == screen_name){
			//sendDM(screen_name,getCosts(geo[0], geo[1], message.direct_message.text));
			console.log("Completed " + screen_name + "\ngeo: " + geo[0] + "," + geo[1]);
			userStream.stop();
		}
	})
}

getUserLocation('dsbuddy27', [12,12] );

getTwitterAPI = function() {
	return twitter;
}
	 
getLyftAPI = function(){
	return lyft;
}

getUberAPI = function(){
	return uber;
}	

getGoogleAPI = function(){
	return google;
}

autoFollowBack = function(sn){
    getTwitterAPI().post("friendships/create", {
    screen_name: sn,
});
    console.log("Followed " + sn);
}

sendDM = function(sn, txt) {
    getTwitterAPI().post("direct_messages/new", {
    screen_name: sn,
    text: txt
    
});
    console.log("DM sent to: " + sn);
    console.log("\tmsg: " +txt);
}

startStream = function(){
    getTwitterAPI().stream('statuses/filter',{track:'traveltimetogo'}).on('tweet', function (tweet) {
        var name = tweet.user.name;
        var screen_name = tweet.user.screen_name;
        autoFollowBack(screen_name);
        var geo = null;
        try{
            geo = tweet.geo.coordinates;
            sendDM(screen_name, "Where would you like to go?");
            setTimeout(function(){
                getUserLocation(screen_name, geo)
            }, 0);       
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

//startStream();