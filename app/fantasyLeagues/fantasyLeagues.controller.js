angular.module('FantasyDerbyApp')
  .controller('FantasyLeagueCtrl', function (FantasyLeagues,leagueData,$transitions,Users,$location,LeagueMessages,$scope,$timeout,Squads) {
    fantasyLeagueCtrl=this;
    fantasyLeagueCtrl.leagueData=leagueData; //Let's try to keep this predominantly for reading....
    fantasyLeagueCtrl.lid=leagueData.$id;

    console.log("LEAGUE DATA",leagueData)

    //This is for writing out the joining URL for the commish
    fantasyLeagueCtrl.joinURL=$location.absUrl();
    fantasyLeagueCtrl.joinURL=fantasyLeagueCtrl.joinURL.split("fantasyLeagues");
    fantasyLeagueCtrl.joinURL=fantasyLeagueCtrl.joinURL[0]+"joinLeague"+fantasyLeagueCtrl.joinURL[1];

    fantasyLeagueCtrl.amCommissioner=leagueData.uniData.Commissioner==competitionCtrl.uid;

    //this is the function for deleting the league
    fantasyLeagueCtrl.removeLeague = function() {
      cid=competitionCtrl.cid;
      lid=leagueData.$id;
      FantasyLeagues.removeLeague(cid,lid,competitionCtrl.profile.$id,fantasyLeagueCtrl.leagueData)
      LeagueMessages.deleteAllLeagueMessages(cid,lid)
    }

    //this adds/rejects new members - used only by the commissioner
    fantasyLeagueCtrl.setMembership=function(key,newState){
      console.log("SET",key,"TO",newState)
      FantasyLeagues.setMembership(key,newState,competitionCtrl.cid,fantasyLeagueCtrl.leagueData.$id)
    }

    //A little function to tell us how many people a user has selected
    fantasyLeagueCtrl.getSelected=function(memberKey,tournamentKey) {
      if (
        fantasyLeagueCtrl.leagueData.fantasySelections &&
        fantasyLeagueCtrl.leagueData.fantasySelections[memberKey] &&
        fantasyLeagueCtrl.leagueData.fantasySelections[memberKey][tournamentKey]
        ) {
        return fantasyLeagueCtrl.leagueData.fantasySelections[memberKey][tournamentKey].length;
      } else {
        return 0
      }
    }
    fantasyLeagueCtrl.getDrafted=function(memberKey,tournamentKey) {
      if (
        fantasyLeagueCtrl.leagueData.fantasyTeams &&
        fantasyLeagueCtrl.leagueData.fantasyTeams[memberKey] &&
        fantasyLeagueCtrl.leagueData.fantasyTeams[memberKey][tournamentKey]
        ) {
        curTeam=fantasyLeagueCtrl.leagueData.fantasyTeams[memberKey][tournamentKey];
        return (curTeam["blocker1"]==""?0:1)+
                (curTeam["blocker2"]==""?0:1)+
                (curTeam["blocker3"]==""?0:1)+
                (curTeam["jammer"]==""?0:1)+
                (curTeam["doubleThreat"]==""?0:1)
      } else {
        return 0;
      }
    }

    //This is an ng-show-called function to check if a given user should be allowed to be removed
    fantasyLeagueCtrl.showAllowRemoval=function(userId) {
      if (fantasyLeagueCtrl.leagueData.uniData.status!='forming') return false;
      if (userId==fantasyLeagueCtrl.leagueData.uniData.Commissioner) return false;
      if (fantasyLeagueCtrl.leagueData.members[userId]!=true) return false;
      return true;
    }
    //And this actually removes the member
    fantasyLeagueCtrl.removeMember=function(userId) {
      FantasyLeagues.removeMember(competitionCtrl.cid,fantasyLeagueCtrl.lid,userId);
    }

    //This holds data about the league members
    //Automatically updated as necessary to hold critical info
    //And prevent repeat firebase calls
    fantasyLeagueCtrl.leagueMembers={};
    fantasyLeagueCtrl.acceptedMembers={};
    fantasyLeagueCtrl.requests=false; //Are there any unanswered membership requests?
    fantasyLeagueCtrl.updateLeagueMemberData=function(){
      fantasyLeagueCtrl.leagueMembers={};
      fantasyLeagueCtrl.acceptedMembers={};
      fantasyLeagueCtrl.requests=false;
      angular.forEach(fantasyLeagueCtrl.leagueData.members,function(curMember,key,LeagueMessages){
        memberObj={
            username: Users.getUsername(key),
            presence: Users.getPresence(key),
            score: 0,
            member: fantasyLeagueCtrl.leagueData.members[key]
          };
        if (fantasyLeagueCtrl.leagueData.fantasyTeams && 
          fantasyLeagueCtrl.leagueData.fantasyTeams[key] && 
          fantasyLeagueCtrl.leagueData.fantasyTeams[key].score) {
          memberObj.score=fantasyLeagueCtrl.leagueData.fantasyTeams[key].score
        }
        fantasyLeagueCtrl.leagueMembers[key]=memberObj;
        if (fantasyLeagueCtrl.leagueMembers[key].member==true) fantasyLeagueCtrl.acceptedMembers[key]=memberObj;
        if (fantasyLeagueCtrl.leagueMembers[key].member==false) fantasyLeagueCtrl.requests=true;
      })
    }
    console.log("MEMBERS",fantasyLeagueCtrl.leagueMembers)

    fantasyLeagueCtrl.draftNeeded=false;
    fantasyLeagueCtrl.whichDraftsNeeded={};
    fantasyLeagueCtrl.checkEligibleDrafts=function(tournamentKey,userId){
      //First get a list of all the players that have been drafted by any user
      
      allDrafts={};
      if (fantasyLeagueCtrl.leagueData.fantasyTeams) {
        angular.forEach(fantasyLeagueCtrl.leagueData.fantasyTeams,function(teamSetDat,teamSetKey) {
          if (teamSetDat && teamSetDat[tournamentKey]) {
            curTeam=teamSetDat[tournamentKey];
            if (curTeam.jammer!="") allDrafts[curTeam.jammer]=true;
            if (curTeam.doubleThreat!="") allDrafts[curTeam.doubleThreat]=true;
            if (curTeam.blocker1!="") allDrafts[curTeam.blocker1]=true;
            if (curTeam.blocker2!="") allDrafts[curTeam.blocker2]=true;
            if (curTeam.blocker3!="") allDrafts[curTeam.blocker3]=true;
          }
        })
      }
      
      //Then check if there is any member in the fantasy selection that isn't matched up already
      var retVal=false;
      if (fantasyLeagueCtrl.leagueData.fantasySelections && fantasyLeagueCtrl.leagueData.fantasySelections[userId] && fantasyLeagueCtrl.leagueData.fantasySelections[userId][tournamentKey]) {
        fantSel=fantasyLeagueCtrl.leagueData.fantasySelections[userId][tournamentKey];
        angular.forEach(fantSel,function(selData,selKey){
          playerKey=selData.id;
          if (!allDrafts[playerKey] 
              && fantasyLeagueCtrl.leagueData.fantasyTeams 
              && fantasyLeagueCtrl.leagueData.fantasyTeams[userId]
              && fantasyLeagueCtrl.leagueData.fantasyTeams[userId][tournamentKey]
            ) {
            //This means this player wasn't selected, but we need to make sure it was in a position they haven't already drafted for
            curTeam=fantasyLeagueCtrl.leagueData.fantasyTeams[userId][tournamentKey];
            if (curTeam.blocker3=="" && selData.position=="blocker") retVal=true;
            if (curTeam.doubleThreat=="" && selData.position=="doubleThreat") retVal=true;
            if (curTeam.jammer=="" && selData.position=="jammer") retVal=true;
              
          }
        })
      }
      return retVal;
    }
    fantasyLeagueCtrl.updateDraftsNeeded=function(){
      fantasyLeagueCtrl.draftNeeded="";

      //First we check and see if there are any drafts we need to make as a player
      angular.forEach(fantasyLeagueCtrl.leagueData.tournaments,function(tournamentVal,tournamentKey){
        //Make sure this tournament is actually being drafted
        if (tournamentVal && competitionCtrl.tournamentData[tournamentKey].state=="readyToSelect") {
          fantasyLeagueCtrl.whichDraftsNeeded[tournamentKey]="";
          console.log("CHECKING FOR",tournamentKey)
          //And make sure that there are draft orders and we are drafting
          if (fantasyLeagueCtrl.leagueData.draftOrders && fantasyLeagueCtrl.leagueData.draftOrders[tournamentKey]) {
            //Next player to draft is...
            tournamentDraftOrder=fantasyLeagueCtrl.leagueData.draftOrders[tournamentKey];
            if (tournamentDraftOrder.length) {
              nextPlayerToDraft=tournamentDraftOrder[0];
              if (nextPlayerToDraft==competitionCtrl.uid) {
                //It's us!
                //Now we need to check if we have eligible drafts that would be satisfied by an auto-draft
                if (!fantasyLeagueCtrl.checkEligibleDrafts(tournamentKey,competitionCtrl.uid)){
                  console.log("GOT TRUE!")
                  fantasyLeagueCtrl.whichDraftsNeeded[tournamentKey]="asPlayer";
                  fantasyLeagueCtrl.draftNeeded="asPlayer"
                }
              }
            }
          }
        }
      })

      //Then we check to see if we need to hit anything as commissioner
      if (fantasyLeagueCtrl.leagueData.uniData.Commissioner==competitionCtrl.uid) {
        //We are the commissioner. So check to see if there are drafts needed
        //Loop over each tournament we are doing
        angular.forEach(fantasyLeagueCtrl.leagueData.tournaments,function(tournamentVal,tournamentKey){
          //Make sure this tournament is actually being drafted
          if (tournamentVal && competitionCtrl.tournamentData[tournamentKey].state=="readyToSelect") {
            if (fantasyLeagueCtrl.leagueData.draftOrders && fantasyLeagueCtrl.leagueData.draftOrders[tournamentKey] && fantasyLeagueCtrl.leagueData.draftOrders[tournamentKey].length) {
              //If they are drafting and we have draft orders etc...
              nextPlayerToDraft=fantasyLeagueCtrl.leagueData.draftOrders[tournamentKey][0];
              console.log("NEXT PLAYER TO DRAFT:",nextPlayerToDraft)
              //See if there are eligible drafts. If so, we should be autodrafting!
              if (fantasyLeagueCtrl.checkEligibleDrafts(tournamentKey,nextPlayerToDraft)) {
                fantasyLeagueCtrl.whichDraftsNeeded[tournamentKey]="asAdmin";
                fantasyLeagueCtrl.draftNeeded="asAdmin"
              }
            };
          }
        })
      }
    }

    //This updates data as necessary every time the league data changes
    fantasyLeagueCtrl.leagueData.$watch(function(newLeagueData){
      console.log("fantasy league changed!",newLeagueData)

      fantasyLeagueCtrl.updateDraftsNeeded();
      fantasyLeagueCtrl.updateLeagueMemberData();
    })
    fantasyLeagueCtrl.updateLeagueMemberData();
    fantasyLeagueCtrl.updateDraftsNeeded();

    //MESSAGING STUFF
    var numMessages=100;
    fantasyLeagueCtrl.messages; //Holds a $firebaseArray of all the current messages
    fantasyLeagueCtrl.message; //Model for the message to send
    LeagueMessages.getMessagesForLeague(competitionCtrl.cid,fantasyLeagueCtrl.leagueData.$id,numMessages).$loaded().then(function(messageData){
      fantasyLeagueCtrl.messages=messageData;
      fantasyLeagueCtrl.messages.$watch(function(){ //This makes sure to scroll to the bottom when new messages appear
        fantasyLeagueCtrl.scrollToBottom();
      })
      $timeout(fantasyLeagueCtrl.scrollToBottom,10); //Dirty fudge :'(
    });

    //This will dynamically load extra messages
    var messageDiv=document.getElementById("messagePane");
    fantasyLeagueCtrl.checkScroll=function(input) {
      if (messageDiv.scrollTop==0) {
        numMessages+=20;

        LeagueMessages.getMessagesForLeague(competitionCtrl.cid,fantasyLeagueCtrl.leagueData.$id,numMessages).$loaded().then(function(messageData){
          fantasyLeagueCtrl.messages=messageData;
        });
      }
    }

    fantasyLeagueCtrl.scrollToBottom=function() {
      messageDiv.scrollTop=messageDiv.scrollHeight;
    }
    $scope.$on('$viewContentLoaded', function() {
        $timeout(fantasyLeagueCtrl.scrollToBottom,0);
    });

    //This is to send messages
    fantasyLeagueCtrl.sendMessage = function() {
      if (fantasyLeagueCtrl.message!="") { //Don't submit empty messages!
        LeagueMessages.sendMessage(competitionCtrl.cid,
                      fantasyLeagueCtrl.leagueData.$id,
                      fantasyLeagueCtrl.message,
                      competitionCtrl.profile.$id,
                      "userMessage");
      }
      fantasyLeagueCtrl.message="";
    }

    //This is to move the fantasy league on from the formation phase to the drafting phase.
    fantasyLeagueCtrl.formingToDrafting=function() {
      Squads.setLeagueToDrafting(competitionCtrl.uid,competitionCtrl.cid,fantasyLeagueCtrl.lid,fantasyLeagueCtrl.leagueData.tournaments);
    }
    //This is to revert from drafting back to formation
    fantasyLeagueCtrl.draftingToForming=function() {
      Squads.revertToFormation(competitionCtrl.cid,fantasyLeagueCtrl.lid,fantasyLeagueCtrl.leagueData.tournaments);
    }
  	
  });