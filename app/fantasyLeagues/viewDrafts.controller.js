angular.module('FantasyDerbyApp')
  .controller('ViewDraftsCtrl', function (competitionID,competitionKeyData,profile,tournamentData,FantasyLeagues,Squads,$scope,Players) {
  	viewDraftsCtrl=this;

  	viewDraftsCtrl.squadData={};
  	viewDraftsCtrl.positions=["jammer","doubleThreat","blocker1","blocker2","blocker3"];
  	viewDraftsCtrl.playerData={};

  	viewDraftsCtrl.addPlayerData=function(squadData) {
  		for (position in viewDraftsCtrl.positions) {
  			curPos=viewDraftsCtrl.positions[position];
  			if (squadData[curPos]) {
  				viewDraftsCtrl.playerData[squadData[curPos]]=Players.getPlayerData(squadData[curPos]);
  			}
  		}
  	}

    viewDraftsCtrl.grabSquads=function(leagueKey) {
        viewDraftsCtrl.squadData[leagueKey]={};
        angular.forEach(competitionCtrl.tournamentData,function(tourData,tourKey){
            viewDraftsCtrl.squadData[leagueKey][tourKey]=Squads.getSquad(competitionCtrl.cid,leagueKey,competitionCtrl.uid,tourKey);
            FantasyLeagues.isDrafting(competitionCtrl.cid,leagueKey,tourKey).$loaded().then(function(isDrafting){
                if (!isDrafting.$value) {
                	viewDraftsCtrl.squadData[leagueKey][tourKey]=null;
                } else {
                	viewDraftsCtrl.addPlayerData(viewDraftsCtrl.squadData[leagueKey][tourKey])
                }
            })
        })
    }

    $scope.$watch('competitionCtrl.myLeagues',function(newVal,oldVal){
    	angular.forEach(newVal,function(leagueName,leagueKey){
    		viewDraftsCtrl.grabSquads(leagueKey);
    	})
    },true);

  });