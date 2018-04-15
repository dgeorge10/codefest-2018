var geo = require("./geoWrapper");

exports.getCost = function(data, taxiFare, callback){
	console.log("Entered taxiWrapper");
	//console.log(data.address);
	geo.locogeate(data, function(res) {
		var temp = res.results[0].address_components;
		var city;
		for (x in temp) if (temp[x].types[0] == 'locality') {
			city = temp[x].short_name.toLowerCase().replace(/\s/g,'');
			break;
    	}
    	temp = taxiFare.get(city);
		if (temp) {
			var tmp =[] 
			tmp.push(['Taxi',parseFloat((parseFloat(temp[0]) + parseFloat(data.miles)*parseFloat(temp[1])).toFixed(2))]);
   			data.taxiPrice=tmp;
		}
		callback(data);
	});
}
