angular.module('FantasyDerbyApp')
  .controller('TeamListCtrl', function (teamData,compName,$stateParams,checkAdmin) {
    teamListCtrl=this;

    teamListCtrl.compName=compName;
    teamListCtrl.teamList=teamData.teamList;
    teamListCtrl.teamName=teamData.teamName;
    teamListCtrl.tournamentId=$stateParams.listId;
    teamListCtrl.isAdmin=checkAdmin

    teamListCtrl.imgSrc="";

    teamListCtrl.teamData={};

    if ($stateParams.listId!="allComp") {
    	teamListCtrl.imgSrc=competitionCtrl.tournamentData[teamListCtrl.tournamentId].imgSrc;
        teamListCtrl.boutsData=Tournaments.getCondensedBoutData(competitionCtrl.cid,teamListCtrl.tournamentId)
    }

    teamListCtrl.saveString=function(teamKey,whichString,whatString) {
        firebase.database().ref().child("teams").child(teamKey).child(whichString).set(whatString);
        console.log("SET ",whatString," AS ",whichString," FOR ",teamKey)
    }


  });