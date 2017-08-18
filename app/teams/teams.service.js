angular.module('FantasyDerbyApp')
	.factory('Teams',function($location,$firebaseObject,$firebaseObject){
		
		var Teams={
			getAffiliatedTeams: function(whichCompetition) {
				//So we are fed a competition, from which we extract the affiliation
				//And then use this to get the list of affiliated teams

				whichAffil="wftda"
				if (whichCompetition=="mrda") whichAffil="mrda";
				//TODO: THIS IS A NASTY HACK AND SHOULD BE BASED ON THE uniData OBJECT OF EACH COMPETITION!!!!
				//PROBABLY NEEDS COMPLETE REFACTORING FOR A PROPER ASYNC METHOD

				var affiliatedRef=firebase.database().ref().child("teamAffiliations").child(whichAffil);
				return $firebaseObject(affiliatedRef)
			},
			getTourTeams: function(cid,tourId) {
				var listRef=firebase.database().ref().child("competitionFull").child(cid).child("tournaments").child(tourId).child("teamList");
				return $firebaseObject(listRef)
			},
			getTeamData: function(teamId) {
				var teamRef=firebase.database().ref().child("teams").child(teamId);
				return $firebaseObject(teamRef);
			}
		};


		return Teams;
	})