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
			},

			getLeagueMembership: function(cid,leagueId) {
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(cid);
				var membersRef=competitionDataRef.child("fantasyLeagues").child(leagueId).child("members")
				return $firebaseObject(membersRef);
			},

			createLeague: function(leagueData,cid) {

				//First we get the database references we need
				var competitionDataRef=firebase.database().ref().child("competitionFull").child($stateParams.cid);
				var flLongRef=competitionDataRef.child("fantasyLeagues");
				var flShortRef=competitionDataRef.child("fantasyLeaguesShort");

				//Then we write in both the 'long' and 'short' data
				var originalEntryKey=flLongRef.push(leagueData).key;
				console.log("KEY:",originalEntryKey)
				flShortRef.child(originalEntryKey).set(true);

				//Now we need to update the owner's profile
				var userId=leagueData.uniData.Commissioner;
				var userRef=firebase.database().ref().child("users").child(userId);
				var leagueMembRef=userRef.child("leagueMembership").child(cid);
				var asCommissioner=leagueMembRef.child("asCommissioner").child(originalEntryKey).set(leagueData.uniData.name)

				$state.go("competitions.fantasyLeagues.summary",{lid:originalEntryKey})
			}
		}

		return FantasyLeagues;
	})