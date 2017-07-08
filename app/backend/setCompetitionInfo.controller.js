angular.module('FantasyDerbyApp')
  .controller('SetCompCtrl', function (compData,shortCompList,$state,teamList) {
    setCompCtrl=this;

    //This is for switching leagues
    setCompCtrl.switchLeague="";
    setCompCtrl.shortCompList=shortCompList;
    setCompCtrl.switch=function() {
    	console.log("Switching to ",setCompCtrl.switchLeague)
    	$state.go("competitions.setCompInfo",{cid:setCompCtrl.switchLeague})
    }

    //The base firebase references
    var baseRef=firebase.database().ref().child("competitionFull").child(compData.$id);
    var baseShortRef=firebase.database().ref().child("competitionShort").child(compData.$id);

    //Team lists
    setCompCtrl.teamList=teamList;
    setCompCtrl.addTeam=function(tournamentKey,teamKey) {
    	console.log("Adding",teamKey,"to",tournamentKey)
    	teamObj= {
    		id: teamKey,
    		teamName: teamList[teamKey].teamName,
    		leagueName: teamList[teamKey].leagueName
    	}
    	console.log("TEAM OBJ",teamObj,teamKey)
    	baseRef.child("tournaments").child(tournamentKey).child("teamList").child(teamKey).set(teamObj)
    }
    setCompCtrl.deleteTeamFromTournament=function(tournamentKey,teamKey) {
    	console.log("GOT",tournamentKey,teamKey)
    	baseRef.child("tournaments").child(tournamentKey).child("teamList").child(teamKey).remove();
    }

    //Set start date for a tournament
    setCompCtrl.setStartDate=function(tournamentKey,year,month,day) {
    	var startDate = new Date(year,month,day,1);
    	baseRef.child("tournaments").child(tournamentKey).child("startDateMilli").set(startDate.getTime())
    	//console.log(tournamentKey,year,month,day,startDate.getTime(),firebase)
    }

    //Useful bits
    setCompCtrl.compData=compData;
    setCompCtrl.working={};

    //Functions and data for re-naming the compeitition
    setCompCtrl.working.fullName=compData.uniData.fullName;
    setCompCtrl.saveFullName=function() {
    	baseRef.child("uniData").child("fullName").set(setCompCtrl.working.fullName)
    }
    setCompCtrl.resetFullName=function() {
    	setCompCtrl.working.fullName=compData.uniData.fullName;
    }

    //Functions and data for changing its description
    setCompCtrl.working.description=compData.uniData.description;
    setCompCtrl.saveDescription=function() {
    	baseRef.child("uniData").child("description").set(setCompCtrl.working.description)
    }
    setCompCtrl.resetDescription=function() {
    	setCompCtrl.working.description=compData.uniData.description;
    }

    //Functions and data for setting the type of the tournament
    setCompCtrl.working.type=compData.uniData.type;
	setCompCtrl.saveType=function() {
    	baseRef.child("uniData").child("type").set(setCompCtrl.working.type)
    }
    setCompCtrl.resetType=function() {
    	setCompCtrl.working.type=compData.uniData.type;
    }

    //Functions and data for setting whether the tournament is visible to the public
    setCompCtrl.working.visible=compData.uniData.visible;
	setCompCtrl.saveVisible=function() {
    	baseRef.child("uniData").child("visible").set(setCompCtrl.working.visible)
    	baseShortRef.child("visible").set(setCompCtrl.working.visible)
    }
    setCompCtrl.resetVisible=function() {
    	setCompCtrl.working.visible=compData.uniData.visible;
    }

    //Add a new tournament to the competitions
    setCompCtrl.addTournament=function() {
    	tournamentObj={
    		name: "New tournament",
    		state: "waitingForData",
    		startDateMilli: "1000",
    		imgSrc: ""
    	}
    	baseRef.child("tournaments").push(tournamentObj)
    }
    setCompCtrl.deleteTournament=function(tournieKey) {
    	baseRef.child("tournaments").child(tournieKey).remove();
    }

    //Setting a new name for a tournament
    setCompCtrl.saveTournamentName = function(tournamentKey,name) {
    	console.log("SAVING TOURNAMENT NAME",name,"FOR",tournamentKey)
    	baseRef.child("tournaments").child(tournamentKey).child("name").set(name)
    }
    setCompCtrl.resetTournamentName = function(tournamentKey) {
    	console.log("TRYING TO RESET",setCompCtrl.working[tournamentKey].tournieName)
    	setCompCtrl.working[tournamentKey].tournieName=compData.tournaments[tournamentKey].name;
    }

    //Setting the status of a tournament
    setCompCtrl.saveTournamentState = function(tournamentKey,state) {
    	baseRef.child("tournaments").child(tournamentKey).child("state").set(state)
    }
  });