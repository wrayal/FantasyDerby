angular.module('FantasyDerbyApp')
  .controller('TeamListCtrl', function (teamData,compName) {
    teamListCtrl=this;

    teamListCtrl.compName=compName;
    teamListCtrl.teamList=teamData.teamList;
    teamListCtrl.teamName=teamData.teamName;

    console.log("Team list",teamListCtrl.teamList)

  });