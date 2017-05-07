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

        var CompetitonData;
        if (subdomain) {
        	comFullRef=comFullRef=firebase.database().ref().child("competitionFull").child(subdomain);
        	CompetitionData={
				humanName:$firebaseObject(comShortRef.child(subdomain)), //Human readable name for this competition
				completeSet:$firebaseObject(comShortRef), //complete set of tournaments in short form
                subdom:subdomain,
				competitionData:$firebaseObject(comFullRef)
			};
        } else {
        	CompetitionData={
        		humanName:"", //no human name here
                subdom:subdomain,
        		completeSet:$firebaseObject(comShortRef), //complete set of tournaments in short form
        	}
        }


		return CompetitionData;
	})