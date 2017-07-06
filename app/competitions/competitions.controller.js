angular.module('FantasyDerbyApp')
  .controller('CompetitionCtrl', function (competitionID,competitionKeyData,profile,tournamentData,FantasyLeagues) {
    competitionCtrl=this;

    competitionCtrl.cid=competitionID;
    competitionCtrl.keyData=competitionKeyData;	
    competitionCtrl.profile=profile;
    competitionCtrl.uid=profile.$id;
    competitionCtrl.tournamentData=tournamentData;
    competitionCtrl.myLeagues={};

    competitionCtrl.updateMyLeagues = function() {
    	//We are going to use this to keep a parsed, up to date list of the leagues of which we are a member
    	fullAffiliatedLeagueList=[];
        if (competitionCtrl.profile.leagueMembership && competitionCtrl.profile.leagueMembership[competitionID]) {
        	angular.forEach(competitionCtrl.profile.leagueMembership[competitionID].asCommissioner,function(value,key){
        		competitionCtrl.myLeagues[key]=value; //When this user is the commissioner, they must be a member
        	})
        	angular.forEach(competitionCtrl.profile.leagueMembership[competitionID].asPlayer,function(value,key){
        		//This is all the leagues where they have requested membership but may not yet have been granted it
        		//Gotta check. Note that this may not update live with approvals...
        		FantasyLeagues.getLeagueMembership(competitionID,key).$loaded().then(function(leagueMembership){
        			if (leagueMembership[competitionCtrl.uid]) {
        				competitionCtrl.myLeagues[key]=value;
        			}
        		})
        	})
        }
    }
    competitionCtrl.profile.$watch(function(){
    	competitionCtrl.updateMyLeagues();
    })
    competitionCtrl.updateMyLeagues();

  });