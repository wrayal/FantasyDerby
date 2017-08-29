angular.module('FantasyDerbyApp')
  .controller('OverallLeaderboardCtrl', function (Users) {
    overallLeaderboardCtrl=this;

    overallLeaderboardCtrl.leadData=[];
    overallLeaderboardCtrl.userData={};

    Competitions.getLeaderboardData(competitionCtrl.cid,"score",30).$loaded().then(function(leadData){
        console.log("LEADERBOARD DATA",leadData)

        alreadyPushed={};
        for (i=leadData.length-1;i>=0; i--) {
            teamsData=leadData[i];
            if (!alreadyPushed[leadData[i].userId]) overallLeaderboardCtrl.leadData.push(teamsData)
            alreadyPushed[teamsData.userId]=true;

            //Now we need to gather the relevant data;
            overallLeaderboardCtrl.userData[teamsData.userId]=Users.getUsername(teamsData.userId);

        }

    })

  });