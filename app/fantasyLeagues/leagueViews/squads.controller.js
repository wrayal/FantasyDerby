angular.module('FantasyDerbyApp')
  .controller('SquadCtrl', function ($stateParams,squadData,selectionData,Teams,$scope,Squads) {
    squadCtrl=this;

    squadCtrl.tourId=$stateParams.sid;
    squadCtrl.squad=squadData;
    squadCtrl.selection=selectionData;

    //Screen configuration
    squadCtrl.display={
      layout: "singlePane", // "singlePane" vs "twoPanes"
      upperPaneUrl: "fantasyLeagues/leagueViews/squadViews/selection.html",
      lowerPaneUrl: "fantasyLeagues/leagueViews/squadViews/blank.html"
    }

    squadCtrl.teams={};
    squadCtrl.extraTeams={};

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
    angular.forEach(squadCtrl.selection,function(selectionEntryData,squadKey){
      console.log("Tell me",squadKey,selectionEntryData)
      squadCtrl.currentSelection[squadKey]={};
      angular.forEach(selectionEntryData,function(dataVal,dataKey){
        console.log("And:",dataKey,dataVal)
        if (dataKey.split("")[0]!="$") squadCtrl.currentSelection[squadKey][dataKey]=dataVal;
      })
    })
    console.log("UGH",squadCtrl.currentSelection)
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
          position: "jammer"
        }

        if (targetKey==-1) {
          squadCtrl.currentSelection.push(playerObject)
        } else {
          squadCtrl.currentSelection.splice(targetKey,0,playerObject)
        }
      } else {
        //Swapping elements in selection
        temp=squadCtrl.currentSelection[sourceKey];
        squadCtrl.currentSelection[sourceKey]=squadCtrl.currentSelection[targetKey]
        squadCtrl.currentSelection[targetKey]=temp;
      }
      $scope.$apply();
    }
    //And some helper functions
    squadCtrl.deleteSelectionEntry=function(key) {
      squadCtrl.currentSelection.splice(key,1)
    }
    squadCtrl.saveSelection=function() {
      Squads.saveSelection(competitionCtrl.cid,fantasyLeagueCtrl.lid,competitionCtrl.profile.$id,squadCtrl.tourId,squadCtrl.currentSelection)
    }
    squadCtrl.undo=function() {
      squadCtrl.currentSelection=squadCtrl.pastSelections.pop().slice();
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
        })
      }
    }
  	
  });