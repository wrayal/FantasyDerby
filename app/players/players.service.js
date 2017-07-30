angular.module('FantasyDerbyApp')
    .factory('Players',function($firebaseObject){
        //Reference for all short form names
        var playerRef=firebase.database().ref().child("players");

        Players={
            getPlayerOwner: function(playerID) {
                return $firebaseObject(playerRef.child(playerID).child('owner'))
            },
            getPlayerData: function(playerID) {
                return $firebaseObject(playerRef.child(playerID))
            },
            getScores: function(cid,tourId,playerId) {
                return $firebaseObject(
                    firebase.database().ref().child("competitionFull").child(cid).child("tournamentScoreData").child(tourId).child("playerData").child(playerId).child("total")
                    );
            },
            getFullScores: function(cid,tourId,playerId) {
                return $firebaseObject(
                    firebase.database().ref().child("competitionFull").child(cid).child("tournamentScoreData").child(tourId).child("playerData").child(playerId)
                    );
            }
        }


        return Players;
    })