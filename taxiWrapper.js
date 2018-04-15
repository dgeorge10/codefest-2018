

getCost = function(miles, taxifare, city){
	var temp = taxifare.get(city.toLowerCase()); 
	if (temp) {
    	return('Average taxi cost near you would be ' + temp[0] + miles*temp[1]);
	}
}