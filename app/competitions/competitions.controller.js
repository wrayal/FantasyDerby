angular.module('FantasyDerbyApp')
  .controller('CompetitionCtrl', function (competitionID,competitionKeyData) {
    competitionCtrl=this;

    competitionCtrl.cid=competitionID;
    competitionCtrl.keyData=competitionKeyData;	
  	
  });