angular.module('FantasyDerbyApp')
    .factory('Players',function($firebaseObject,$firebaseArray){
        //Reference for all short form names
        var playerRef=firebase.database().ref().child("players");

        Players={
            getPlayerOwner: function(playerID) {
                return $firebaseObject(playerRef.child(playerID).child('owner'))
            },
            getPlayerData: function(playerID) {
                return $firebaseObject(playerRef.child(playerID))
            },
            getFullScores: function(cid,tourId,playerId) { //This is the full weight data for a tournament, including bout breakdown
                return $firebaseObject(
                    firebase.database().ref().child("competitionFull").child(cid).child("tournamentScoreData").child(tourId).child("playerData").child(playerId)
                    );
            },
            getTotalScoresForTournament: function(cid,tourId,playerId) {
                return $firebaseObject(
                    firebase.database().ref().child("competitionFull").child(cid).child("tournamentScoreData").child(tourId).child("playerData").child(playerId).child("total")
                    );
            },
            getCompetitionTotal: function(cid,playerId) {
                return $firebaseObject(
                    firebase.database().ref().child("competitionFull").child(cid).child("tournamentScoreData").child("combinedPlayerScores").child(playerId)
                    );
            },
            getBestByTournament: function(cid,tourId,criterion,number) {
                var scoreRef=firebase.database().ref().child("competitionFull").child(cid).child("tournamentScoreData");
                var preciseRef=scoreRef.child(tourId).child("playerData");
                return $firebaseArray(preciseRef.orderByChild("total/"+criterion).limitToLast(number));
            },
            getAllPlayers: function() { //ONLY AS A LAST RESORT!
                return $firebaseObject(playerRef)
            }
        }


        return Players;
    })