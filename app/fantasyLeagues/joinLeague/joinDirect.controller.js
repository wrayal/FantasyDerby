angular.module('FantasyDerbyApp')
  .controller('JoinDirectCtrl', function (leagueId,leagueData,Users,profile) {
    joinDirectCtrl=this;

    joinDirectCtrl.leagueId=leagueId;
    joinDirectCtrl.leagueData=leagueData;
    joinDirectCtrl.commish=Users.getUsername(joinDirectCtrl.leagueData.Commissioner);

    joinDirectCtrl.profile=profile;
    
    joinDirectCtrl.joinStatus=function() {
    	status=""

    	try {
    		if (!!joinDirectCtrl.profile.leagueMembership[competitionCtrl.cid].asPlayer[leagueId]) {
    			return "member"
    		}
    	} catch(e){};

    	if (leagueData.isOpen) {
    		return "canJoin"
    	} else {
    		return "canRequest"
    	}
    }

    joinDirectCtrl.teamName="";
    joinDirectCtrl.nameError="";
    joinDirectCtrl.join=function(openToJoin) {
        if (joinDirectCtrl.teamName=="") {
            joinDirectCtrl.nameError="Please enter a name for your team";
            return;
        }
    	console.log("Joining",leagueId,"; open? ",openToJoin)
    	cidTS=competitionCtrl.cid;
    	lidTS=leagueId;
    	otjTS=openToJoin;
    	proID=competitionCtrl.profile.$id;
    	lName=leagueData.name;
        tName=joinDirectCtrl.teamName;
        console.log("TEAM NAME",tName)
    	
    	FantasyLeagues.joinLeague(cidTS,lidTS,otjTS,proID,lName,tName)
    }
  });