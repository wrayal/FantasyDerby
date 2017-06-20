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
            }
        }


        return Players;
    })