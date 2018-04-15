var request = require('request');


geolocate = function (address, cbk) {
    var uri = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+keys.google.key;
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
            cbk(null,result.results[0].geometry.location);
        }
    });
};

