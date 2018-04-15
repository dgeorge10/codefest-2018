exports.getCost = function(data, taxiFare, callback){
	console.log("Entered taxiWrapper");
	var temp = res.results[0].address_components;
	var city;
	for (x in temp) if (temp[x].types[0] == 'locality') {
		city = temp[x].short_name.toLowerCase().replace(/\s/g,'');
		break;
    }
	var temp = taxiFare.get(city);
	if (temp) {
   		data.taxiPrice=["Taxi", temp[0] + data.miles*temp[1]];
	}
	callback(data);
}
