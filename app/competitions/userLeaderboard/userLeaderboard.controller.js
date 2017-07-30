angular.module('FantasyDerbyApp')
  .controller('UserLeaderboardCtrl', function ($stateParams,Players,Competitions,Users) {
    userLeaderboardCtrl=this;

    userLeaderboardCtrl.tourId="";
    userLeaderboardCtrl.leadData=[];
    userLeaderboardCtrl.userData={};
    userLeaderboardCtrl.playerData={};
    userLeaderboardCtrl.tourId=$stateParams.tourId;

    userLeaderboardCtrl.positions=["jammer","doubleThreat","blocker1","blocker2","blocker3"]

    Competitions.getLeaderboardData(competitionCtrl.cid,
        ($stateParams.tourId=="overall"?"score":(userLeaderboardCtrl.tourId+"/score"))
    ,30).$loaded().then(function(leadData){
        console.log("LEAD DATA:",leadData)
        alreadyPushed={};
        for (i=leadData.length-1;i>=0; i--) {
            if (!alreadyPushed[leadData[i].userId]) userLeaderboardCtrl.leadData.push(leadData[i])
            alreadyPushed[leadData[i].userId]=true;

            if (userLeaderboardCtrl.tourId=="overall") {

            } else {
                curSquad=leadData[i][userLeaderboardCtrl.tourId];
                for (j=0; j<userLeaderboardCtrl.positions.length; j++) {
                    position=userLeaderboardCtrl.positions[j];
                    if (!userLeaderboardCtrl.playerData[curSquad[position]]) {
                        userLeaderboardCtrl.playerData[curSquad[position]]={
                            data:Players.getPlayerData(curSquad[position]),
                            scores:Players.getTotalScores(competitionCtrl.cid,userLeaderboardCtrl.tourId,curSquad[position])
                        }
                    }
                }
            }
        }

        angular.forEach(leadData,function(teamsData,userId){
            userLeaderboardCtrl.userData[teamsData.userId]=Users.getUsername(teamsData.userId);
        });
    })


  });