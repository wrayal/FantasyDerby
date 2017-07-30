angular.module('FantasyDerbyApp')
  .controller('PlayerLeaderboardCtrl', function ($stateParams,Players) {
    playerLeaderboardCtrl=this;

    playerLeaderboardCtrl.tournamentId=$stateParams.tourId;
    playerLeaderboardCtrl.tourData=competitionCtrl.tournamentData[playerLeaderboardCtrl.tournamentId];

    playerLeaderboardCtrl.playerData={};

    playerLeaderboardCtrl.jmrData=[];
    Players.getBestByTournament(competitionCtrl.cid,playerLeaderboardCtrl.tournamentId,"jmrFDScore",20).$loaded().then(function(jammerData){
        for (i=jammerData.length-1; i>=0; i--) {
            playerLeaderboardCtrl.jmrData.push(jammerData[i])
            playerLeaderboardCtrl.playerData[jammerData[i].$id]=Players.getPlayerData(jammerData[i].$id);
        }
    })

    playerLeaderboardCtrl.dtData=[];
    Players.getBestByTournament(competitionCtrl.cid,playerLeaderboardCtrl.tournamentId,"dtFDScore",20).$loaded().then(function(dtData){
        for (i=dtData.length-1; i>=0; i--) {
            playerLeaderboardCtrl.dtData.push(dtData[i])
            playerLeaderboardCtrl.playerData[dtData[i].$id]=Players.getPlayerData(dtData[i].$id);
        }
    })

    playerLeaderboardCtrl.blData=[];
    Players.getBestByTournament(competitionCtrl.cid,playerLeaderboardCtrl.tournamentId,"blFDScore",20).$loaded().then(function(blData){
        for (i=blData.length-1; i>=0; i--) {
            playerLeaderboardCtrl.blData.push(blData[i])
            playerLeaderboardCtrl.playerData[blData[i].$id]=Players.getPlayerData(blData[i].$id);
        }
    })

  });