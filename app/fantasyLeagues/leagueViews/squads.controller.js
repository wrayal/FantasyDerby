angular.module('FantasyDerbyApp')
  .controller('SquadCtrl', function ($stateParams,squadData,selectionData,Teams,$scope,Squads,fantasyTeams,draftOrder,LeagueMessages,Players) {
    squadCtrl=this;

    squadCtrl.tourId=$stateParams.sid;
    squadCtrl.tourData=competitionCtrl.tournamentData[squadCtrl.tourId];
    squadCtrl.squad=squadData;
    squadCtrl.selection=selectionData;
    squadCtrl.fantasyTeams=fantasyTeams;
    squadCtrl.draftOrder=draftOrder;

    //Screen configuration
    //Possible configurations:
    //0) Waiting for data
    //1) Pre-drafting it's just the selection screen [one pane]
    //2) During drafting it's selection + seeing drafts (+ draft order) [two panes]
    //3) ...or doing your own spot-draft + seeing drafts [two panes]
    //4) Once all drafts are finished we just want to show the drafts [one pane]
    squadCtrl.detailedStatus=function() {
      //Ok, if drafting is possible, let's check if the tournament has data yet!
      if (squadCtrl.tourData.state=="waitingForData") return "waitingForData";
      //Easy case second
      if (fantasyLeagueCtrl.leagueData.uniData.status=='forming') return "forming";
      //Now check if we need a spot draft from this user
      //We check everyone in their "selected" list and see if any of them is viable
      if (!draftOrder[0]) {
        return "draftCompleted"
      }
      if (draftOrder[0]==competitionCtrl.uid) { //If it's this user's "turn"...
        viableDraft=false
        angular.forEach(squadCtrl.selection,function(value,key){ //Loop over each player
          if (!squadCtrl.draftedPlayers[value.id]) { //Make sure they haven't been drafted
            if (
              (value.position=="jammer" && squadData.jammer=="") ||
              (value.position=="doubleThreat" && squadData.doubleThreat=="") ||
              (value.position=="blocker" && squadData.blocker1=="") ||
              (value.position=="blocker" && squadData.blocker2=="") ||
              (value.position=="blocker" && squadData.blocker3=="")
               )
            {
              viableDraft=true;
            }
          }
        })
        if (viableDraft==false) return "spotDraft"
      }
      return "drafting";
    }
    squadCtrl.layout=function(){
      if (fantasyLeagueCtrl.leagueData.uniData.status=='forming' || squadCtrl.detailedStatus()=='draftCompleted' || squadCtrl.detailedStatus()=="waitingForData") return "singlePane";
      else return "twoPanes";
    }
    squadCtrl.upperPaneUrl=function(){
      if (squadCtrl.detailedStatus()=="waitingForData") return "fantasyLeagues/leagueViews/squadViews/waitingForData.html"
      if  (squadCtrl.detailedStatus()=="spotDraft") return "fantasyLeagues/leagueViews/squadViews/spotDraft.html"
      if  (squadCtrl.detailedStatus()=='draftCompleted') return "fantasyLeagues/leagueViews/squadViews/squadsDrafted.html"
      return "fantasyLeagues/leagueViews/squadViews/selection.html"
    }
    squadCtrl.lowerPaneUrl=function(){
      if (fantasyLeagueCtrl.leagueData.uniData.status=='drafting') return "fantasyLeagues/leagueViews/squadViews/draftingList.html";
      return "fantasyLeagues/leagueViews/squadViews/blank.html";
    }

    squadCtrl.teams={};
    squadCtrl.extraTeams={};

    //Keeps an up to date list of players that have already been drafted
    //Prevents double-drafting
    squadCtrl.draftedPlayers={};
    squadCtrl.positions=["jammer","doubleThreat","blocker1","blocker2","blocker3"];
    squadCtrl.updateDraftedPlayers=function(){
      if (fantasyLeagueCtrl.leagueData.uniData.status=='forming') {
        squadCtrl.draftedPlayers={}; //This is the only way players can be "undrafted"...
      }
      if (fantasyLeagueCtrl.leagueData.uniData.status!='forming') {
        angular.forEach(fantasyLeagueCtrl.leagueMembers,function(leagueMember,memberKey){
          //For each user, grab the appropriate squad
          curSquad=squadCtrl.fantasyTeams[memberKey][squadCtrl.tourId];
          
          for (i=0; i<squadCtrl.positions.length; i++) {
            //and for each player, check if they have info, or otherwise update it
            currentPlayerId=curSquad[squadCtrl.positions[i]];
            if (currentPlayerId!="" && !squadCtrl.draftedPlayers[currentPlayerId]) {
              squadCtrl.draftedPlayers[currentPlayerId]={
                data:Players.getPlayerData(currentPlayerId),
                draftedBy: memberKey
              }
            }
          }
        })
      }
    }
    fantasyTeams.$watch(function(fantasyTeamData){
      console.log("FANTASY TEAM CHANGED")
      squadCtrl.autoDraftStatus="";
      squadCtrl.updateDraftedPlayers();
    })
    squadCtrl.updateDraftedPlayers();

    //Current selection data
    squadCtrl.currentSelectionPrime=""; //This is what is selected in the first box
    squadCtrl.currectSelectionExtra=""; //This in the second
    squadCtrl.currentSelectionTeam=""; //And this is what we should actually show

    //Making the approrpriate data available for the interface to show
    squadCtrl.switchTeamSelect=function() {
      if (squadCtrl.currentSelectionPrime=="other") {
        //Ok, they've selected to look at other teams...
        if (Object.keys(squadCtrl.extraTeams).length==0) {
          squadCtrl.extraTeams=Teams.getAffiliatedTeams(competitionCtrl.cid)
        }
        if (squadCtrl.currectSelectionExtra) {
          squadCtrl.currentSelectionTeam=squadCtrl.currectSelectionExtra;
        }
      } else {
        squadCtrl.currentSelectionTeam=squadCtrl.currentSelectionPrime
      }

      if (squadCtrl.currentSelectionTeam && !squadCtrl.teams[squadCtrl.currentSelectionTeam]) {
        squadCtrl.teams[squadCtrl.currentSelectionTeam]=Teams.getTeamData(squadCtrl.currentSelectionTeam);
      }
    }

    //Dealing with intricacies of drag/drop
    squadCtrl.currentSelection=[];
    squadCtrl.pastSelections=[];
    squadCtrl.lastSaved=[];
    angular.forEach(squadCtrl.selection,function(selectionEntryData,squadKey){
      squadCtrl.currentSelection[squadKey]={};
      angular.forEach(selectionEntryData,function(dataVal,dataKey){
        if (dataKey.split("")[0]!="$") squadCtrl.currentSelection[squadKey][dataKey]=dataVal;
      })
      squadCtrl.lastSaved=[];
      angular.copy(squadCtrl.currentSelection,squadCtrl.lastSaved);
      //squadCtrl.lastSaved=squadCtrl.currentSelection.slice();
    })
    squadCtrl.dropped=function(dragEl,dropEl) {
      var source=angular.element(dragEl).attr('whatSource'); //teamData or selectionData
      var sourceKey=angular.element(dragEl).attr('whatKey');
      var targetKey=angular.element(dropEl).attr('whatKey');
      squadCtrl.pastSelections.push(squadCtrl.currentSelection.slice())
      if (source=="teamData") {
        //Adding new elements from teams
        sourcePlayer=squadCtrl.teams[squadCtrl.currentSelectionTeam].teamPlayers[sourceKey];
        playerObject={
          id: sourcePlayer.id,
          name: sourcePlayer.name,
          number: sourcePlayer.number,
          position: "blocker"
        }

        if (targetKey==-1) {
          squadCtrl.currentSelection.push(playerObject)
        } else {
          squadCtrl.currentSelection.splice(targetKey-0,0,playerObject)
        }
      } else {
        //Swapping elements in selection
        temp=squadCtrl.currentSelection[sourceKey];
        squadCtrl.currentSelection[sourceKey]=squadCtrl.currentSelection[targetKey]
        squadCtrl.currentSelection[targetKey]=temp;
      }
      squadCtrl.saveSelection();
      $scope.$apply();
    }
    //And some helper functions
    squadCtrl.deleteSelectionEntry=function(key) {
      squadCtrl.pastSelections.push(squadCtrl.currentSelection.slice())
      squadCtrl.currentSelection.splice(key,1)
      squadCtrl.saveSelection()
    }
    squadCtrl.saveSelection=function() {
      console.log("SAVE CALLED!")
      squadCtrl.lastSaved=[];
      angular.copy(squadCtrl.currentSelection,squadCtrl.lastSaved);
      Squads.saveSelection(competitionCtrl.cid,fantasyLeagueCtrl.lid,competitionCtrl.profile.$id,squadCtrl.tourId,squadCtrl.currentSelection)
    }
    squadCtrl.undo=function() {
      squadCtrl.currentSelection=squadCtrl.pastSelections.pop().slice();
      squadCtrl.saveSelection()
    }
    squadCtrl.updatePosition=function() {
      squadCtrl.pastSelections.push(squadCtrl.lastSaved);
      squadCtrl.saveSelection();
    }

    //This allows the user to copy their selection order from another league
    squadCtrl.sourceLeague="";
    squadCtrl.copyFromExisting=function() {
      if (competitionCtrl.sourceLeague!="") {
        Squads.getSelection(competitionCtrl.cid,squadCtrl.sourceLeague,competitionCtrl.uid,squadCtrl.tourId).$loaded().then(function(squadData){
          angular.forEach(squadData,function(selectionEntryData,squadKey){
            squadCtrl.currentSelection[squadKey]={};
            angular.forEach(selectionEntryData,function(dataVal,dataKey){
              if (dataKey.split("")[0]!="$") squadCtrl.currentSelection[squadKey][dataKey]=dataVal;
            })
          })
          squadCtrl.saveSelection();
        })
      }
    }

    //Convenience numbers to let us know how many people they should draft
    squadCtrl.maxJammers=Object.keys(fantasyLeagueCtrl.leagueMembers).length;
    squadCtrl.maxBlockers=3*Object.keys(fantasyLeagueCtrl.leagueMembers).length;
    squadCtrl.maxDTs=Object.keys(fantasyLeagueCtrl.leagueMembers).length;
    squadCtrl.selectedJammers=0;
    squadCtrl.selectedDTs=0;
    squadCtrl.selectedBlockers=0;
    squadCtrl.selectedPlayers=0;
    squadCtrl.updateSelNumbers=function(){
      squadCtrl.selectedJammers=0
      squadCtrl.selectedDTs=0
      squadCtrl.selectedBlockers=0
      squadCtrl.selectedPlayers=0
      angular.forEach(squadCtrl.selection,function(selEntry){
        if (selEntry.position=="jammer") {squadCtrl.selectedJammers++;squadCtrl.selectedPlayers++};
        if (selEntry.position=="doubleThreat") {squadCtrl.selectedDTs++;squadCtrl.selectedPlayers++};
        if (selEntry.position=="blocker") {squadCtrl.selectedBlockers++;squadCtrl.selectedPlayers++};
      })
    }
    squadCtrl.selection.$watch(function(selData){squadCtrl.updateSelNumbers();})
    squadCtrl.updateSelNumbers();


    //Skip the current draft entry
    squadCtrl.skipDraft=function() {
      var competitionRef=firebase.database().ref().child("competitionFull").child(competitionCtrl.cid);
      var leagueRef=competitionRef.child("fantasyLeagues").child(fantasyLeagueCtrl.lid);
      squadCtrl.autoDraftStatus="";
      leagueRef.child("draftOrders").child(squadCtrl.tourId).once("value",function(draftDataObj){
        draftData=draftDataObj.val();
        tempMem=draftData.shift();
        draftData=draftData.concat([tempMem]);
        leagueRef.child("draftOrders").child(squadCtrl.tourId).set(draftData)
      })
    }

    //Actually perform a draft
    squadCtrl.doDraft=function(playerId,position,user,shouldAutoDraft,playerName) {
      console.log("Drafting ",playerId," as",position," for ",user)
      var competitionRef=firebase.database().ref().child("competitionFull").child(competitionCtrl.cid);
      var leagueRef=competitionRef.child("fantasyLeagues").child(fantasyLeagueCtrl.lid);
      var squadRef=leagueRef.child("fantasyTeams").child(user).child(squadCtrl.tourId);

      //Ok, we actually set the draft position
      squadRef.child(position).set(playerId).then(function(){
        //Now we update the drafting order
        leagueRef.child("draftOrders").child(squadCtrl.tourId).once("value",function(draftOrderObj){
          newDraftOrder=draftOrderObj.val();
          leagueRef.child("draftOrders").child(squadCtrl.tourId).set(newDraftOrder.slice(1)).then(function(){
            //squadCtrl.draftOrder.$loaded();//Just make sure we get this updated
            //Now we add a league message
            LeagueMessages.sendDraftMessage(competitionCtrl.cid,fantasyLeagueCtrl.lid,user,playerName,position);
            //Then make sure the fantasy teams and league players are updated
            squadCtrl.fantasyTeams.$loaded().then(function(){
              squadCtrl.updateDraftedPlayers();
              if (shouldAutoDraft) squadCtrl.autoDraft();
            })
          })
        })
      })

    }

    //Do the auto-draft procedure
    squadCtrl.autoDraftStatus="";
    squadCtrl.autoDraft=function() {
      squadCtrl.autoDraftStatus="Drafting";
      console.log(squadCtrl.autoDraftStatus)
      //Ok, here comes the drafting process - get ready to get fiddly!
      //First we grab useful firebase references
      var competitionRef=firebase.database().ref().child("competitionFull").child(competitionCtrl.cid);
      var leagueRef=competitionRef.child("fantasyLeagues").child(fantasyLeagueCtrl.lid);

      //Now we are going to load the latest iterations of the draft orders to find the next player in line
      leagueRef.child("draftOrders").child(squadCtrl.tourId).once("value",function(draftDataObj){
        draftData=draftDataObj.val();
        nextManToDraft=draftData[0];
        try{squadCtrl.autoDraftStatus="Drafting for "+fantasyLeagueCtrl.leagueMembers[nextManToDraft].username.$value;}catch(err){} //Being lazy - can technically fail if requisite data not loaded yet
        console.log(squadCtrl.autoDraftStatus)
        //And then we are going to load their selection list
        leagueRef.child("fantasySelections").child(nextManToDraft).child(squadCtrl.tourId).once("value",function(fantasySelectionObj){
          //And double check that the league data is fully up to date so we have the latest fantasy squads
          fantasyLeagueCtrl.leagueData.$loaded().then(function(latestLeagueData){
            currentSquad=latestLeagueData.fantasyTeams[nextManToDraft][squadCtrl.tourId]; //Current squad for the player
            fantasySelection=fantasySelectionObj.val(); //Current selection for the player
            console.log("Current selection:",fantasySelection)
            succeeded=false;
            for (i=0; fantasySelection && i<fantasySelection.length && !succeeded; i++) {
              currentPotentialDraft=fantasySelection[i]; //Next one to check
              if (
                !squadCtrl.draftedPlayers[currentPotentialDraft.id] && (
                  (currentPotentialDraft.position=="jammer" && currentSquad.jammer=="") ||
                  (currentPotentialDraft.position=="doubleThreat" && currentSquad.doubleThreat=="") ||
                  (currentPotentialDraft.position=="blocker" && currentSquad.blocker3=="") //suffices to just check this one as we will fill it last
                )
              ) {
                succeeded=true;
                try{squadCtrl.autoDraftStatus="Drafting "+currentPotentialDraft.name+" for "+fantasyLeagueCtrl.leagueMembers[nextManToDraft].username.$value;}catch(err){} //Being lazy - can technically fail if requisite data not loaded yet
                console.log(squadCtrl.autoDraftStatus)
                if (currentPotentialDraft.position=="jammer") {
                  squadCtrl.doDraft(currentPotentialDraft.id,"jammer",nextManToDraft,true,currentPotentialDraft.name)
                } else if (currentPotentialDraft.position=="doubleThreat") {
                  squadCtrl.doDraft(currentPotentialDraft.id,"doubleThreat",nextManToDraft,true,currentPotentialDraft.name)
                } else if (currentSquad.blocker1=="") {
                  squadCtrl.doDraft(currentPotentialDraft.id,"blocker1",nextManToDraft,true,currentPotentialDraft.name)
                } else if (currentSquad.blocker2=="") {
                  squadCtrl.doDraft(currentPotentialDraft.id,"blocker2",nextManToDraft,true,currentPotentialDraft.name)
                } else if (currentSquad.blocker3=="") {
                  squadCtrl.doDraft(currentPotentialDraft.id,"blocker3",nextManToDraft,true,currentPotentialDraft.name)
                }
              }
            }
            if (!succeeded) {
              try{squadCtrl.autoDraftStatus="No available draft candidates for "+fantasyLeagueCtrl.leagueMembers[nextManToDraft].username.$value;}
              catch(err){squadCtrl.autoDraftStatus="No available draft candidates."} //Being lazy - can technically fail if requisite data not loaded yet
              console.log(squadCtrl.autoDraftStatus)
            }
          })
        })
      })
    }

    //Useful bits for doing spot-drafting
    squadCtrl.convObj={
      jammer: "Jammer",
      doubleThreat: "Double Threat",
      blocker: "Blocker"
    }
    squadCtrl.spotDraftPosition="";
    squadCtrl.spotDraft=function(pid,playerName,playerNumber) {
      squadData.$loaded().then(function(){ //make sure it's up to date....

        //Add it to their selection list in case they want to copy to another league
        playerObject={
          id: pid,
          name: playerName,
          number: playerNumber,
          position: squadCtrl.spotDraftPosition
        }
        squadCtrl.currentSelection.push(playerObject)
        squadCtrl.saveSelection();

        //Then do the draft
        if (squadCtrl.spotDraftPosition=="jammer" || squadCtrl.spotDraftPosition=="doubleThreat") {
          squadCtrl.doDraft(pid,squadCtrl.spotDraftPosition,competitionCtrl.uid,false,playerName)
        } else if (squadData.blocker1=="") {
          squadCtrl.doDraft(pid,"blocker1",competitionCtrl.uid,false,playerName)
        } else if (squadData.blocker2=="") {
          squadCtrl.doDraft(pid,"blocker2",competitionCtrl.uid,false,playerName)
        } else {
          squadCtrl.doDraft(pid,"blocker3",competitionCtrl.uid,false,playerName)
        }
        squadCtrl.spotDraftPosition="";
      })
    }
  	
  });