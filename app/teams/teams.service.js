angular.module('FantasyDerbyApp')
	.factory('Teams',function($location,$firebaseObject,$firebaseObject){
		
		var Teams={
			getAffiliatedTeams: function(whichAffil) {
				var affiliatedRef=firebase.database().ref().child("teamAffiliations").child(whichAffil);
				return $firebaseObject(affiliatedRef);
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