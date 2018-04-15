

exports.getCost = function(data, taxiFare, callback){
	console.log("Entered taxiWrapper");
	var keys = taxiFare.keys();
	var c;
	var city = null;
	while(c = keys.next()){
		if(data.address.includes(c)){
			city = c;
			console.log("City: " + city);
		}
	}	

	var temp = taxiFare.get(city.toLowerCase());
	if (temp) {
   		data.taxiPrice=["Taxi", temp[0] + data.miles*temp[1]];
	}
	callback(data);
}
