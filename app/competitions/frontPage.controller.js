angular.module('FantasyDerbyApp')
  .controller('FrontPageCtrl', function (competitionData,$firebaseObject,$scope,BlogMessages) {
    frontPageCtrl=this;

   	frontPageCtrl.competitionData=competitionData;
   	frontPageCtrl.blogMessages=BlogMessages.getBlogData(competitionCtrl.cid)
  	
  });