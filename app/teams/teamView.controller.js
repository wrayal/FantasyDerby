angular.module('FantasyDerbyApp')
  .controller('TeamViewCtrl', function (teamData) {
    teamViewCtrl=this;

    teamViewCtrl.teamData=teamData;

  });