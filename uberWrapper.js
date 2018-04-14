var bot = require("./bot");


function uberWrapper(){
	this.uberAPI = bot.uber;	

}

uberWrapper.prototype.getEstimate = function(startLong, startLat, endLong, endLat){ 
	console.log("Implement Uber Estimate");	
};


