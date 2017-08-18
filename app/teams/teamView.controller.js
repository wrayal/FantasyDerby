angular.module('FantasyDerbyApp')
  .controller('TeamViewCtrl', function (teamData,Players,$scope) {
    teamViewCtrl=this;

    teamViewCtrl.teamData=teamData;

    teamViewCtrl.shouldShow=false;
    teamViewCtrl.playerScoreData={};

    teamData.$loaded().then(function(teamData){
    	for (i=0; i<teamData.teamPlayers.length; i++) {
    		curPlayer=teamData.teamPlayers[i];
    		curPlayerId=curPlayer.id;
    		
    		if (!teamViewCtrl.playerScoreData[curPlayerId]) {
                teamViewCtrl.entries++;
                teamViewCtrl.playerScoreData[curPlayerId]=Players.getCompetitionTotal(competitionCtrl.cid,curPlayerId);
                teamViewCtrl.playerScoreData[curPlayerId].$loaded().then(function(curData){
                    if (!teamViewCtrl.shouldShow) {
                        teamViewCtrl.shouldShow=(!!curData.blFDScore || !!curData.jmrFDScore || !!curData.dtFDScore)
                    }
                })
            }
    	}
    })

    teamViewCtrl.metric=0;

    $scope.myComparator=function(player) {
        if (teamViewCtrl.metric) {
            if (teamViewCtrl.playerScoreData[player.id][teamViewCtrl.metric])
                return -teamViewCtrl.playerScoreData[player.id][teamViewCtrl.metric];
            else return 1000000
        } else {
            return player.id;
        }
    }

    teamViewCtrl.setSort=function(sortCriterion) {
       teamViewCtrl.metric=sortCriterion
    }

  });