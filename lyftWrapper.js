var bot = require("./bot");


function lyftWrapper(){
	this.lyftAPI = bot.lyft;	

}

lyftWrapper.prototype.getEstimate = function(startLong, startLat, endLong, endLat){ 
	console.log("Implement Uber Estimate");	
};


