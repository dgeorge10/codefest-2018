var request = require('request');
var keys = require('./keys');

exports.geolocate = function (data, cbk) {
    console.log("Entered geoWrapper");
    var uri = "https://maps.googleapis.com/maps/api/geocode/json?address="+data.address.replace(/\s/g,"+")+"&key="+keys.google.key;
    request({
        uri: uri
    }, function(err,resp,body) {
        if (err) return cbk(err);
        var result;
        try {
            result = JSON.parse(body);
        } catch (err) {
            cbk(err);
            return;
        }
        if (typeof cbk === "function") {
            var temp = result.results[0].geometry.location; 
            data.endLat = temp.lat;
            data.endLng = temp.lng;
            cbk(data);
        }
    });
};

exports.locogeate = function(data, cbk) {
    console.log("Entered geoWrapper");
    var uri = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.endLat+","+data.endLng+"&result_type=street_address&key="+keys.google.key;
    request({
        uri: uri
    }, function(err,resp,body) {
        if (err) return cbk(err);
        var result;
        try {
            result = JSON.parse(body);
        } catch (err) {
            cbk(err);
            return;
        }
        if (typeof cbk === "function") {
            cbk(result);
        }
    });
};