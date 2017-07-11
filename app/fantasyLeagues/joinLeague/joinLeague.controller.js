angular.module('FantasyDerbyApp')
  .controller('JoinLeagueCtrl', function (FantasyLeagues,Users,$scope) {
    joinLeagueCtrl=this;

  	console.log("LET'S JOIN A LEAGUE!")

    //This will hold all the data we actually want to display to the screen
    joinLeagueCtrl.allData={};
    joinLeagueCtrl.allDataArray=[];

    //Here we get a list of all the leagues///
    joinLeagueCtrl.leagueList=FantasyLeagues.getAllLeaguesShort();
    joinLeagueCtrl.leagueList.$loaded().then(function(leagueList){
      //We iterate over all of them and grab the pertinent data from the database
      angular.forEach(leagueList, function(value,key){
        joinLeagueCtrl.allData[key]=FantasyLeagues.getLeagueCommonData(key,competitionCtrl.cid);
        joinLeagueCtrl.allData[key].commissionerName="";
        //And then make a call to figure out the actual display name of the commissioner
        joinLeagueCtrl.allData[key].$loaded().then(function(leagueData){
          Users.getUsername(leagueData.Commissioner).$loaded().then(function(gotName){
            joinLeagueCtrl.allData[key].commissionerName=gotName.$value;
            joinLeagueCtrl.allData[key].key=key;
            joinLeagueCtrl.allDataArray.push(joinLeagueCtrl.allData[key]);
          })
        
        })
      })
    })

    joinLeagueCtrl.desiredTeamName="";
    joinLeagueCtrl.join=function(leagueId,openToJoin,leagueName) {
      console.log("Joining",leagueId,"; open? ",openToJoin)
      joinLeagueCtrl.nameError="";
      if (joinLeagueCtrl.desiredTeamName=="") {
        alert("Please enter a name for your team!")
        joinLeagueCtrl.nameError="Please enter a team name."
        return;
      }
      FantasyLeagues.joinLeague(competitionCtrl.cid,leagueId,openToJoin,competitionCtrl.profile.$id,leagueName,joinLeagueCtrl.desiredTeamName)
    }

    joinLeagueCtrl.joinStatus=function(curLeagueData) {

      key=curLeagueData.key;
      leagueStatus=curLeagueData.status;

      joinStatus="";

      //First we check whether they are the commissioner for a given league
      try {
        if (!!competitionCtrl.profile.leagueMembership[competitionCtrl.cid].asCommissioner[key]) {
          joinStatus="commissioner";
          return joinStatus
        } else {
          joinStatus="";
        }
      } catch(e) {
        joinStatus="";
      }
      if (joinStatus=="commissioner") return joinStatus;

      //If the league isn't still in it's formation phase, we dump out
      if (leagueStatus!="forming") {
        joinStatus="drafting"
        return joinStatus;
      }

      //Now they have either requested to join, or they haven't, and might be able to
      if (indexCtrl.leagueMemberships[key]) { //If they have already joined/requested or something
        if (indexCtrl.leagueMemberships[key][competitionCtrl.profile.$id]==true) {
          joinStatus="member"
          return joinStatus;
        } else if (indexCtrl.leagueMemberships[key][competitionCtrl.profile.$id]=='rejected') {
          joinStatus="rejected"
          return joinStatus;
        } else if (indexCtrl.leagueMemberships[key][competitionCtrl.profile.$id]==false) {
          joinStatus="requested"
          return joinStatus;
        } else { //This happens while data is still being written...
          joinStatus="requested"
          return joinStatus;
        }

      } else { //OK, they haven't joined/requested already; let's give them the option to join
        if (curLeagueData.isOpen) {
          joinStatus="canJoin"
          return joinStatus;
        } else {
          joinStatus="canRequest"
          return joinStatus;
        }
      }
      console.log("Houston we have a FUCKUP",key,leagueStatus,curLeagueData,joinStatus)
      return 0;
    }


  });