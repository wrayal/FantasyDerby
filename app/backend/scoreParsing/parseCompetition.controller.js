angular.module('FantasyDerbyApp')
  .controller('ParseCompetitionCtrl', function ($state,$scope) {
    parseCompetitionCtrl=this;

    //Useful firebase references for all the data pushing we are about to have to do
    var compRef=firebase.database().ref().child("competitionFull").child(competitionCtrl.cid);
    var flRef=compRef.child("fantasyLeagues");

    parseCompetitionCtrl.switchTournament="";
    parseCompetitionCtrl.switch=function() {
      console.log("SWITCHING TO",parseCompetitionCtrl.switchTournament)
      $state.go('competitions.competitionParse.tournamentParse', {tournamentId:parseCompetitionCtrl.switchTournament});
    }

    overallPlayerScores={};
    parseCompetitionCtrl.state="";
    parseCompetitionCtrl.computeOverallScores=function() {
      parseCompetitionCtrl.state="working";
      overallPlayerScores={};
      firebase.database().ref().child("competitionFull").child(competitionCtrl.cid).child("tournamentScoreData").once('value').then(function(fullDataSnapshot) {
        fullData=fullDataSnapshot.val();
        console.log("FULL DATA",fullData)
        angular.forEach(fullData,function(tournieData,tournieKey){
          if (tournieKey!="overall") {
            //Great, we have a whole bunch of data...
            curPlayerList=tournieData.playerData;
            angular.forEach(curPlayerList,function(playerData,playerKey){

              if (overallPlayerScores[playerKey]) {
                overallPlayerScores[playerKey].blFDScore+=playerData.total.blFDScore;
                overallPlayerScores[playerKey].dtFDScore+=playerData.total.dtFDScore;
                overallPlayerScores[playerKey].jmrFDScore+=playerData.total.jmrFDScore;
              } else {
                overallPlayerScores[playerKey]={
                  blFDScore: playerData.total.blFDScore,
                  dtFDScore: playerData.total.dtFDScore,
                  jmrFDScore: playerData.total.jmrFDScore
                }
              }
            })
          }
        })//End of loop over all different tournaments

        firebase.database().ref().child("competitionFull").child(competitionCtrl.cid).child("tournamentScoreData").child("combinedPlayerScores").set(overallPlayerScores)
        parseCompetitionCtrl.state="done";
        $scope.$apply();
      })
    }

  });