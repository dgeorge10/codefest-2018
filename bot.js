var keys = require('./keys');
var geoWrapper = require("./geoWrapper");
var fs = require("fs");



var Lyft = require('node-lyft');
var defaultClient = Lyft.ApiClient.instance;
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


var Twit = require('twit')
const twitter = new Twit({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token: keys.twitter.access_token,
    access_token_secret: keys.twitter.access_token_secret,
    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
});

function newData (startLat,startLng,screen_name,seats=1){
    var data = {};

    data.startLat = startLat;
    data.startLng = startLng;
    data.screen_name =  screen_name;
    data.seats = seats;

    data.endLong = null;
    data.endLat = null;
    data.uberPrice = [];
    data.lyftPrice = [];
    data.taxiPrice = [];

    data.print = function(){
        return "startLat: " + data.startLat + "\nstartLng:" + data.startLng + "\nscreen_name:" + screen_name + "\nseats: " + seats;
    };

    return data;
}

