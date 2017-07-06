angular.module('FantasyDerbyApp')
	.factory('LeagueMessages',function($firebaseObject,$firebaseArray){

		var FantasyLeagueMessages={
			getMessagesForLeague: function(competitionId,leagueId,numMessages) {
				var competitionRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var messagesRef=competitionRef.child("leagueMessages").child(leagueId).orderByChild("timestamp").limitToLast(numMessages);
				return $firebaseArray(messagesRef);
			},
			sendMessage: function(competitionId,leagueId,message,userId,messageType) {
				var competitionRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var messagesRef=competitionRef.child("leagueMessages").child(leagueId)
				var messageObj={
					message: message,
					timestamp: firebase.database.ServerValue.TIMESTAMP,
					type: messageType,
					userId: userId
				}
				messagesRef.push(messageObj);
			},
			deleteAllLeagueMessages: function(competitionId,leagueId) {
				var competitionRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var messagesRef=competitionRef.child("leagueMessages").child(leagueId);
				messagesRef.remove();
			},
			sendDraftMessage: function(competitionId,leagueId,uid,playerName,position) {
				//This creates a message to be shown in the chat pane letting people know a draft was made
				var competitionRef=firebase.database().ref().child("competitionFull").child(competitionId);
				var messagesRef=competitionRef.child("leagueMessages").child(leagueId)
				var messageObj={
					timestamp: firebase.database.ServerValue.TIMESTAMP,
					type: "draftMessage",
					playerName: playerName,
					uid: uid,
					position:""
				}
				if (position=="jammer") {
					messageObj.position="Jammer"
				} else if (position=="doubleThreat") {
					messageObj.position="Double Threat"
				} else {
					messageObj.position="Blocker"
				}
				messagesRef.push(messageObj);
			}
		}

		return FantasyLeagueMessages;
	});