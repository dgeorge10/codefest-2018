var keys = require('./keys')

var Lyft = require('node-lyft')
var defaultClient = Lyft.ApiClient.instance;
defaultClient.authentications['Client Authentication'].accessToken = keys.lyft.client_token
const lyft = new Lyft.PublicApi();

var GoogleMapsAPI = require('googlemaps')
const gmAPI = new GoogleMapsAPI({
    key: keys.google.key,
    stagger_time: 1000, // for elevationPath
    encode_polylines:   false,
    secure:             true // use https
});

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
})
