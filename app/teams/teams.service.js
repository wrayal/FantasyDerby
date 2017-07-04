angular.module('FantasyDerbyApp')
	.factory('Teams',function($location,$firebaseObject,$firebaseObject){
		
		var Teams={
			getAffiliatedTeams: function(whichAffil) {
				var affiliatedRef=firebase.database().ref().child("teamAffiliations").child(whichAffil);
				return $firebaseObject(affiliatedRef);
			},
			getTeamData: function(teamId) {
				var teamRef=firebase.database().ref().child("teams").child(teamId);
				return $firebaseObject(teamRef);
			}
		};


		return Teams;
	})