angular.module('FantasyDerbyApp')
	.factory('FantasyLeagues',function($location,$firebaseObject,$stateParams,$state){

		//Note code out here is only run on service instantiation
		//Not, e.g. on switching to a new competition

		FantasyLeagues={
			getCurrentLeagueData: function(competitionId,leagueId) { //Get data for the current league
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var leagueRef=competitionDataRef.child("fantasyLeagues").child(leagueId);
				return $firebaseObject(leagueRef);
			},

			getAllLeaguesShort: function() { //Get the list of all leagues
				var competitionDataRef=firebase.database().ref().child("competitionFull").child($stateParams.cid);
				var shortLeagueDataRef=competitionDataRef.child("fantasyLeaguesShort")
				return $firebaseObject(shortLeagueDataRef);
			},

			isDrafting: function(competitionId,leagueId,tournamentId) {
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var leagueRef=competitionDataRef.child("fantasyLeagues").child(leagueId);
				return $firebaseObject(leagueRef.child("tournaments").child(tournamentId))
			},

			getLeagueCommonData: function(leagueId,competitionId) { //Get the key data for a given league - potentially called a lot
				console.log("BEFORE",$stateParams)
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var commonDataRef=competitionDataRef.child("fantasyLeagues").child(leagueId).child("uniData")
				return $firebaseObject(commonDataRef);
			},

			getLeagueMembership: function(cid,leagueId) { //Get the member list for a league
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(cid);
				var membersRef=competitionDataRef.child("fantasyLeagues").child(leagueId).child("members")
				return $firebaseObject(membersRef);
			},

			joinLeague: function(cid,leagueId,openJoin,uid,leagueName,teamName) { //Join a league
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(cid);
				var leagueRef=competitionDataRef.child("fantasyLeagues").child(leagueId);
				var membersRef=leagueRef.child("members");

				console.log("Joining with deets",cid,leagueId,openJoin,uid,leagueName,teamName)

				//Give them their fantasy team
				leagueRef.child("fantasyTeams").child(uid).set({name: teamName})

				//Then actually add them
				updateData={};
				updateData[uid]=openJoin;
				membersRef.update(updateData).then(function(){
					var usersRef=firebase.database().ref().child("users");
					var asPlayerRef=usersRef.child(uid).child("leagueMembership").child(cid).child("asPlayer");
					updateData={};
					updateData[leagueId]=leagueName;
					asPlayerRef.update(updateData);
				})
			},

			createLeague: function(leagueData,cid,affiliation) { //Create a league. Expects a fully constructed league object

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

				//Finally we add an initial message
				var messageObj={
					message: "Welcome to "+leagueData.uniData.name,
					timestamp: firebase.database.ServerValue.TIMESTAMP,
					type: "userMessage",
					userId: leagueData.uniData.Commissioner
				}
				var messagesRef=competitionDataRef.child("leagueMessages").child(originalEntryKey)
				messagesRef.push(messageObj);

				$state.go("competitions.fantasyLeagues.summary",{lid:originalEntryKey})
			},

			removeLeague: function(cid,lid,userId,leagueData) { //Delete a league
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(cid);
				var shortLeagueDataRef=competitionDataRef.child("fantasyLeaguesShort").child(lid);
				var leagueDataRef=competitionDataRef.child("fantasyLeagues").child(lid);

				angular.forEach(leagueData.members,function(value,userKey){
					if (userKey!=userId) { //commissioner won't have an entry
						asPlayerRef=firebase.database().ref().child("users").child(userKey).child("leagueMembership").child(cid).child("asPlayer");
						asPlayerRef.child(lid).remove();
					}
				})

				//First we get rid of the league data
				shortLeagueDataRef.remove();
				leagueDataRef.remove();

				//And then we get rid of the user's commissioner reference
				var userRef=firebase.database().ref().child("users").child(userId);
				var leagueMembRef=userRef.child("leagueMembership").child(cid);
				var asCommissioner=leagueMembRef.child("asCommissioner").child(lid);

				asCommissioner.remove();
				//DONE!

				$state.go('competitions.frontPage')
				
			},

			setMembership: function(userId,newState,competitionId,leagueId) {
				console.log(userId,newState,competitionId,leagueId)
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var leagueDataRef=competitionDataRef.child("fantasyLeagues").child(leagueId);
				var membersRef=leagueDataRef.child("members");
				var particularRef=membersRef.child(userId);

				console.log("Relevant obj",$firebaseObject(particularRef))

				particularRef.set(newState)
			},

			removeMember: function(cid,lid,uid) {
				console.log("REMOVING",cid,lid,uid)
				//We need to remove:
				// - Them as members
				// - The entry from their menu stuff
				// - Their team entry
				var competitionDataRef=firebase.database().ref().child("competitionFull").child(cid);
				var leagueDataRef=competitionDataRef.child("fantasyLeagues").child(lid);

				var memberRef=leagueDataRef.child("members").child(uid);
				memberRef.set("rejected");

				var teamDataRef=leagueDataRef.child("fantasyTeams").child(uid);
				teamDataRef.remove();


			}
		}

		return FantasyLeagues;
	})