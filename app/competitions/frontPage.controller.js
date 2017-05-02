angular.module('FantasyDerbyApp')
  .controller('FrontPageCtrl', function (competitionData,$firebaseObject,$scope,$rootScope) {
    frontPageCtrl=this;

    frontPageCtrl.subdomain=competitionData.subdomain;

   	frontPageCtrl.ref=firebase.database().ref();
   	frontPageCtrl.data=$firebaseObject(frontPageCtrl.ref);
  	
  });