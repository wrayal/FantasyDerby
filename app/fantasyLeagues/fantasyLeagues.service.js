angular.module('FantasyDerbyApp')
	.factory('FantasyLeagues',function($location,$firebaseObject,$stateParams,$state){

		//Note code out here is only run on service instantiation
		//Not, e.g. on switching to a new competition

		FantasyLeagues={
			getCurrentLeagueData: function(competitionId,leagueId) {
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var leagueRef=competitionDataRef.child("fantasyLeagues").child(leagueId);
				return $firebaseObject(leagueRef);
			},

			getAllLeaguesShort: function() {
				var competitionDataRef=firebase.database().ref().child("competitionFull").child($stateParams.cid);
				var shortLeagueDataRef=competitionDataRef.child("fantasyLeaguesShort")
				return $firebaseObject(shortLeagueDataRef);
			},

			getLeagueCommonData: function(leagueId) {
				var competitionDataRef=firebase.database().ref().child("competitionFull").child($stateParams.cid);
				var commonDataRef=competitionDataRef.child("fantasyLeagues").child(leagueId).child("uniData")
				return $firebaseObject(commonDataRef);
			}
		}

		return FantasyLeagues;
	})