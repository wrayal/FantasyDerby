angular.module('FantasyDerbyApp')
	.factory('Competitions',function($location,$firebaseObject){
		//Reference for all short form names
		var comShortRef=firebase.database().ref().child("competitionShort");

		//Extract subdomain
		var host = $location.host();
		var subdomain = "";
    	if (host.indexOf('.') < 0) 
        	subdomain=null;
    	else
        	subdomain=host.split('.')[0]

		var CompetitionData={
			humanName:$firebaseObject(comShortRef.child(subdomain)), //Human readable name for this competition
			completeSet:$firebaseObject(comShortRef) //complete set of links
		};


		return CompetitionData;
	})