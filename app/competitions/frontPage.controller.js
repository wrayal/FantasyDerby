angular.module('FantasyDerbyApp')
  .controller('FrontPageCtrl', function (competitionData,$firebaseObject,$scope) {
    frontPageCtrl=this;

   	frontPageCtrl.competitionData=competitionData;
  	
  });