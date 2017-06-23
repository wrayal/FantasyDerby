angular.module('FantasyDerbyApp')
  .controller('CompetitionCtrl', function (competitionID,competitionKeyData,profile) {
    competitionCtrl=this;

    competitionCtrl.cid=competitionID;
    competitionCtrl.keyData=competitionKeyData;	
    competitionCtrl.profile=profile;

  });