angular.module('FantasyDerbyApp')
  .controller('TeamListCtrl', function (teamData) {
    teamListCtrl=this;

    teamListCtrl.teamList=teamData.teamList;
    teamListCtrl.teamName=teamData.teamName;

    console.log("Team list",teamListCtrl.teamList)

  });