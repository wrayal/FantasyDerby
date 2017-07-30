angular.module('FantasyDerbyApp')
  .controller('TeamListCtrl', function (teamData,compName,$stateParams) {
    teamListCtrl=this;

    teamListCtrl.compName=compName;
    teamListCtrl.teamList=teamData.teamList;
    teamListCtrl.teamName=teamData.teamName;

    teamListCtrl.imgSrc="";

    if ($stateParams.listId!="allComp") {
    	teamListCtrl.imgSrc=competitionCtrl.tournamentData[$stateParams.listId].imgSrc;
    }


  });