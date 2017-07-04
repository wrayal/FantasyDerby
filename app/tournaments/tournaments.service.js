angular.module('FantasyDerbyApp')
    .factory('Tournaments',function($firebaseObject){

        Tournaments={
            getAllTournaments: function(competitionId) {
                var compRef=firebase.database().ref().child("competitionFull").child(competitionId);
                var tournRef=compRef.child("tournaments")
                return $firebaseObject(tournRef)
            }
        }


        return Tournaments;
    })