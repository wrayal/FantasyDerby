angular.module('FantasyDerbyApp')
  .controller('ParseCompetitionCtrl', function ($state) {
    parseCompetitionCtrl=this;

    //Useful firebase references for all the data pushing we are about to have to do
    var compRef=firebase.database().ref().child("competitionFull").child(competitionCtrl.cid);
    var flRef=compRef.child("fantasyLeagues");

    parseCompetitionCtrl.switchTournament="";
    parseCompetitionCtrl.switch=function() {
      console.log("SWITCHING TO",parseCompetitionCtrl.switchTournament)
      $state.go('competitions.competitionParse.tournamentParse', {tournamentId:parseCompetitionCtrl.switchTournament});
    }

  });