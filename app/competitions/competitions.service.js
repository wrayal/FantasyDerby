angular.module('FantasyDerbyApp')
	.factory('Competitions',function($location){
		
		var host = $location.host();
		var subdomain = "";
    	if (host.indexOf('.') < 0) 
        	subdomain=null;
    	else
        	subdomain=host.split('.')[0]

		var CompetitionData={
			"subdomain": subdomain,
			"humanName": subdomain?subdomain.toUpperCase():null
		};


		return CompetitionData;
	})