angular.module('FantasyDerbyApp')
  .controller('TeamListCtrl', function (teamData,compName,$stateParams) {
    teamListCtrl=this;

    teamListCtrl.compName=compName;
    teamListCtrl.teamList=teamData.teamList;
    teamListCtrl.teamName=teamData.teamName;
    teamListCtrl.tournamentId=$stateParams.listId;

    teamListCtrl.imgSrc="";

    teamListCtrl.teamData={};

    if ($stateParams.listId!="allComp") {
    	teamListCtrl.imgSrc=competitionCtrl.tournamentData[teamListCtrl.tournamentId].imgSrc;
        teamListCtrl.boutsData=Tournaments.getCondensedBoutData(competitionCtrl.cid,teamListCtrl.tournamentId)
    }


  });