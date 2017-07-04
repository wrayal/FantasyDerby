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
			}
		}

		return FantasyLeagueMessages;
	});