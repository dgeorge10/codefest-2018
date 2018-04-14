var bot = require("./bot");


function googleWrapper(){
	this.googleAPI = bot.google;	

}

googleWrapper.prototype.getEstimate = function(startLong, startLat, endLong, endLat){ 
	console.log("Implement Uber Estimate");	
};


