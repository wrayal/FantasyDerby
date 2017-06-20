angular.module('FantasyDerbyApp')
  .controller('FrontPageCtrl', function (competitionData,$firebaseObject,$scope,$rootScope) {
    frontPageCtrl=this;

   	frontPageCtrl.competitionData=competitionData;
  	
  });