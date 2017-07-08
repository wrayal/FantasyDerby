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
    fantasyLeagueCtrl.updateLeagueMemberData=function(){
      angular.forEach(fantasyLeagueCtrl.leagueData.members,function(curMember,key,LeagueMessages){
        if (!fantasyLeagueCtrl.leagueMembers[key] || fantasyLeagueCtrl.leagueMembers[key].member!=true) {
          fantasyLeagueCtrl.leagueMembers[key]={
            username: Users.getUsername(key),
            presence: Users.getPresence(key),
            member: fantasyLeagueCtrl.leagueData.members[key]
          }
        }
      })
    }
    console.log("MEMBERS",fantasyLeagueCtrl.leagueMembers)

    //This updates data as necessary every time the league data changes
    fantasyLeagueCtrl.leagueData.$watch(function(newLeagueData){
      console.log("fantasy league changed!",newLeagueData)

      fantasyLeagueCtrl.updateLeagueMemberData();
    })
    fantasyLeagueCtrl.updateLeagueMemberData();

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