angular.module('FantasyDerbyApp')
  .controller('ParseTournamentCtrl', function ($stateParams,tournamentScoreData,$firebaseObject,$scope,Teams,Players) {
    parseTournamentCtrl=this;
  	
  	//Make all data conveniently accessible
  	parseTournamentCtrl.tournamentId=$stateParams.tournamentId;
    parseTournamentCtrl.tournamentData=competitionCtrl.tournamentData[parseTournamentCtrl.tournamentId];
    parseTournamentCtrl.tournamentScores=tournamentScoreData;

    //Useful firebase references for all the data pushing we are about to have to do
    var compRef=firebase.database().ref().child("competitionFull").child(competitionCtrl.cid);
    var flRef=compRef.child("fantasyLeagues");
    var tournScoreRef=compRef.child("tournamentScoreData").child(parseTournamentCtrl.tournamentId)
    var boutDataRef=tournScoreRef.child("boutData");
    var playerDataRef=tournScoreRef.child("playerData");

    parseTournamentCtrl.teamPlayersByNumber={}; //Here we will hold all team players referenced by team id -> number
    parseTournamentCtrl.teamPlayerLists={};

    //Get all the possible affiliated teams
    parseTournamentCtrl.affiliatedTeams={};
    Teams.getAffiliatedTeams(competitionCtrl.cid).$loaded().then(function(affilData){
        angular.forEach(affilData,function(teamData,teamKey){
            parseTournamentCtrl.affiliatedTeams[teamKey]=teamData;
        })
    })

    //Get firebase objects for the bouts - so we can just save particular bout objects rather than the whole tournament etc
    //I honestly can't believe this is the best way but...show me a better one?
    parseTournamentCtrl.bouts={};
    parseTournamentCtrl.tournamentScores.$loaded().then(function(tournamentScoreData){
        angular.forEach(tournamentScoreData.boutData,function(boutData,boutKey){
            parseTournamentCtrl.bouts[boutKey]=$firebaseObject(tournScoreRef.child("boutData").child(boutKey));
        })
    })

    //We are going to want all the data for all the teams in this tournament, so let's grab it
    angular.forEach(parseTournamentCtrl.tournamentData.teamList,function(teamData,teamKey) {
    	//Let's grab this team...
    	Teams.getTeamData(teamKey).$loaded().then(function(fullTeamData) {
    		parseTournamentCtrl.teamPlayersByNumber[teamKey]={};
            parseTournamentCtrl.teamPlayerLists[teamKey]=fullTeamData;
    		for (i=0; i<fullTeamData.teamPlayers.length;i++) {
    			parseTournamentCtrl.teamPlayersByNumber[teamKey][fullTeamData.teamPlayers[i].number]=fullTeamData.teamPlayers[i];
    		}
    	})
    })
    parseTournamentCtrl.addTeamData=function(teamId) {
        if (teamId) {
            Teams.getTeamData(teamId).$loaded().then(function(fullTeamData) {
                parseTournamentCtrl.teamPlayerLists[teamId]=fullTeamData;
            })
        }
    }

    //This will hold profiles for players, for temporary display of data such as their name
    parseTournamentCtrl.playerData={};
    parseTournamentCtrl.updatePlayerData=function() {
        parseTournamentCtrl.tournamentScores.$loaded().then(function(){
            angular.forEach(parseTournamentCtrl.tournamentScores.boutData,function(boutData,boutKey){
                parseTournamentCtrl.bouts[boutKey].$loaded().then(function(){
                    for (i=0; i<parseTournamentCtrl.bouts[boutKey]["team1"].teamList.length; i++) {
                        curPlayer=parseTournamentCtrl.bouts[boutKey]["team1"].teamList[i];
                        if (curPlayer.playerId && !parseTournamentCtrl.playerData[curPlayer.playerId]) {
                            parseTournamentCtrl.playerData[curPlayer.playerId]=Players.getPlayerData(curPlayer.playerId);
                        }
                    }
                    for (i=0; i<parseTournamentCtrl.bouts[boutKey]["team2"].teamList.length; i++) {
                        curPlayer=parseTournamentCtrl.bouts[boutKey]["team2"].teamList[i];
                        if (curPlayer.playerId && !parseTournamentCtrl.playerData[curPlayer.playerId]) {
                            parseTournamentCtrl.playerData[curPlayer.playerId]=Players.getPlayerData(curPlayer.playerId);
                        }
                    }
                })
            })
        })
    }
    parseTournamentCtrl.updatePlayerData();

    parseTournamentCtrl.working={}; //Working object for holding bits of data about the tournament
    //Add a new bout to the tournament
    parseTournamentCtrl.addBout=function() {
    	boutObj={
    		name: "New bout"
    	}
    	newKey=boutDataRef.push(boutObj).getKey();
        parseTournamentCtrl.bouts[newKey]=$firebaseObject(tournScoreRef.child("boutData").child(newKey));
    }
    //Delete a given bout
    parseTournamentCtrl.deleteBout=function(boutId) {
    	boutDataRef.child(boutId).remove();
    }
    //Init a bout with the given excel data
    parseTournamentCtrl.initFromExcel=function(boutId,excelData) {
    	parsedBout=parseTournamentCtrl.excelParseScores(excelData);
    	
    	if (parsedBout) {
    		parsedBout.name=parsedBout.team1.name+" vs "+parsedBout.team2.name;
    		boutDataRef.child(boutId).set(parsedBout).then(function(){$scope.$apply()})
    	}
    }
    //Save player IDs
    parseTournamentCtrl.savedIdData=function(boutKey) {
        console.log("GOING TO SAVE",parseTournamentCtrl.tournamentScores.boutData[boutKey])
        t1List=parseTournamentCtrl.tournamentScores.boutData[boutKey].team1.teamList;
        t2List=parseTournamentCtrl.tournamentScores.boutData[boutKey].team2.teamList;
        for (i=0; i<t1List.length; i++) {
            if (t1List[i].playerId) {
                boutDataRef.child(boutKey).child("team1").child("teamList").child(i).child("playerId").set(t1List[i].playerId)
            }
        }
        for (i=0; i<t2List.length; i++) {
            if (t2List[i].playerId) {
                boutDataRef.child(boutKey).child("team2").child("teamList").child(i).child("playerId").set(t2List[i].playerId)
            }
        }
    }
    //Figure out who all these players are based on their numbers
    parseTournamentCtrl.matchPlayers=function(boutKey,whichTeam,teamId) {
    	for (i=0; i<parseTournamentCtrl.tournamentScores.boutData[boutKey][whichTeam].teamList.length; i++) {
    		curPlayer=parseTournamentCtrl.bouts[boutKey][whichTeam].teamList[i];
    		console.log("CUR PLAYER IS",curPlayer)
    		if (parseTournamentCtrl.teamPlayersByNumber[teamId][curPlayer.number]) {
    			curPlayer.playerId=parseTournamentCtrl.teamPlayersByNumber[teamId][curPlayer.number].id
    		}
    	}
        parseTournamentCtrl.updatePlayerData();
    }
    //Save our raw data into the DB.
    parseTournamentCtrl.intoPlayedNeeded=false;
    parseTournamentCtrl.saveRawData=function(boutKey) {
        parseTournamentCtrl.intoPlayedNeeded=true;
        parseTournamentCtrl.bouts[boutKey].$save();
        parseTournamentCtrl.working[boutKey].needSave=false;
        console.log("bout obj:",parseTournamentCtrl.bouts[boutKey])
    }

    parseTournamentCtrl.diffToFD=function(inputScore) {
        k=10;
        e=2.718281828;

        if (inputScore>0) return k+inputScore;
        else return k*Math.pow(e,inputScore/k);
    }

    parseTournamentCtrl.parseFDScores=function(boutKey) { //This will parse in some Fantasy Derby scores :)
        curBout=parseTournamentCtrl.bouts[boutKey];
        teams=["team1","team2"];
        for (i=0; i<teams.length; i++) {
            whichTeam=teams[i];
            angular.forEach(curBout[whichTeam].teamList,function(playerData,playerKey){
                blockerDiff=(playerData.pivPm-0)+(playerData.blPm-0);
                jammerDiff=(playerData.jmrPm-0);
                penalties=playerData.pens-0;
                leadsAsJammer=playerData.lead-0;
                totalJams=playerData.totJams-0;
                
                blockerPMScore=parseTournamentCtrl.diffToFD(blockerDiff);
                jammerPMScore=parseTournamentCtrl.diffToFD(jammerDiff);
                penaltyScore=3*(7-penalties);
                jammerLeadScore=3*leadsAsJammer;

                blockerScore=penaltyScore+blockerPMScore;
                doubleThreatScore=penaltyScore+blockerPMScore+jammerLeadScore+jammerPMScore;
                jammerScore=penaltyScore+jammerLeadScore+jammerPMScore;

                if ( (playerData.jmrJams-0)==0) {
                    jammerScore-=jammerPMScore;
                    doubleThreatScore-=jammerPMScore;
                }
                if ( ((playerData.blJams-0)+(playerData.pivJams-0))==0) {
                    blockerScore-=blockerPMScore;
                    doubleThreatScore-=blockerPMScore;
                }


                playerData.jmrFDScore=Math.floor(jammerScore*10)/10;
                playerData.dtFDScore=Math.floor(doubleThreatScore*10)/10;
                playerData.blFDScore=Math.floor(blockerScore*10)/10;

                if (totalJams==0) {
                    playerData.jmrFDScore=0;
                    playerData.dtFDScore=0;
                    playerData.blFDScore=0;
                }
            })
        }
    }

    //Separate out into player scores
    parseTournamentCtrl.parsedPlayers={};
    parseTournamentCtrl.toParse={};
    parseTournamentCtrl.parseIntoPlayers=function(boutKey){
        parseTournamentCtrl.fullySaved=false;
        parseTournamentCtrl.intoPlayedNeeded=false;
        parseTournamentCtrl.toParse[boutKey]=0;
        parseTournamentCtrl.parsedPlayers[boutKey]=0;
        teams=["team1","team2"];
        parseTournamentCtrl.bouts[boutKey].$loaded().then(function(boutData){

            for (i=0; i<teams.length; i++) {
                whichTeam=teams[i];
                teamList=boutData[whichTeam].teamList;
                for (j=0; j<teamList.length; j++) {
                    if (curPlayer.playerId) {
                        parseTournamentCtrl.toParse[boutKey]++;
                    }
                    curPlayer=teamList[j];
                    
                    //Create the minimal data
                    boutObj={
                        blFDScore: curPlayer.blFDScore,
                        dtFDScore: curPlayer.dtFDScore,
                        jmrFDScore: curPlayer.jmrFDScore,
                        playerId: curPlayer.playerId
                    }
                    console.log("BOUT OBJ",boutObj)

                    //If we had a player Id then store
                    if (curPlayer.playerId) {
                        playerDataRef.child(curPlayer.playerId).child(boutKey).set(boutObj,function(){
                            parseTournamentCtrl.parsedPlayers[boutKey]++;
                            console.log("UGH:",parseTournamentCtrl.parsedPlayers[boutKey])
                            $scope.$apply()
                        })
                    }

                }
            }

        })
    }

    parseTournamentCtrl.completeScores=function(){
        playerDataRef.once('value').then(function(playersSnapshot) {
            fullPlayerData=playersSnapshot.val();
            angular.forEach(fullPlayerData,function(plData,playerId){
                var totalObj={
                    blFDScore: 0,
                    dtFDScore: 0,
                    jmrFDScore: 0
                }
                totalObj.blFDScore=0;
                totalObj.dtFDScore=0;
                totalObj.jmrFDScore=0;
                angular.forEach(plData,function(boutData,boutKey){
                    if (boutKey!="total") {
                        totalObj.blFDScore+=boutData.blFDScore;
                        totalObj.dtFDScore+=boutData.dtFDScore;
                        totalObj.jmrFDScore+=boutData.jmrFDScore;
                    }
                })
                playerDataRef.child(playerId).child("total").set({
                    blFDScore: totalObj.blFDScore,
                    dtFDScore: totalObj.dtFDScore,
                    jmrFDScore: totalObj.jmrFDScore,
                });
            })
            parseTournamentCtrl.updateUserScores();
        })
    }

    parseTournamentCtrl.fullySaved=true;
    parseTournamentCtrl.updateUserScores=function(){
        playerDataRef.once('value').then(function(playersSnapshot) {
            fullPlayerData=playersSnapshot.val();
            
            flRef.once('value').then(function(fantasyLeagueSnapshot){ //Load all leagues
                flData=fantasyLeagueSnapshot.val();
                angular.forEach(flData,function(leagueData,leagueKey) { //For each league
                    if (leagueData.fantasyTeams) {
                        angular.forEach(leagueData.fantasyTeams,function(teamData,userId){ //For each user's set of teams in that league
                            if (teamData[parseTournamentCtrl.tournamentId]) { //If they drafted for this tournament
                                curTeam=teamData[parseTournamentCtrl.tournamentId];

                                squadScore=0;
                                if (fullPlayerData[curTeam.jammer]) {
                                    squadScore+=fullPlayerData[curTeam.jammer].total.jmrFDScore
                                }
                                if (fullPlayerData[curTeam.doubleThreat]) {
                                    squadScore+=fullPlayerData[curTeam.doubleThreat].total.dtFDScore
                                }
                                if (fullPlayerData[curTeam.blocker1]) {
                                    squadScore+=fullPlayerData[curTeam.blocker1].total.blFDScore
                                }
                                if (fullPlayerData[curTeam.blocker2]) {
                                    squadScore+=fullPlayerData[curTeam.blocker2].total.blFDScore
                                }
                                if (fullPlayerData[curTeam.blocker3]) {
                                    squadScore+=fullPlayerData[curTeam.blocker3].total.blFDScore
                                }

                                flRef.child(leagueKey).child("fantasyTeams").child(userId).child(parseTournamentCtrl.tournamentId).child("score").set(squadScore)

                                totalScore=0;
                                totalScore+=squadScore;
                                angular.forEach(competitionCtrl.tournamentData,function(tourData,tourKey){
                                    if (tourKey!=parseTournamentCtrl.tournamentId && teamData[tourKey].score) {
                                        totalScore+=teamData[tourKey].score
                                    }
                                })
                                flRef.child(leagueKey).child("fantasyTeams").child(userId).child("score").set(totalScore)

                            }
                        })
                    }
                })
            })

        })
        parseTournamentCtrl.fullySaved=true;
        $scope.$apply();
    }

    parseTournamentCtrl.excelParseScores=function(unparsedData){
    	lines=unparsedData.split("\n");
    	
    	//Sanity checks:
    	if (lines[0].slice(0,1)!="W") {
    		alert("NOT W!")
    		return;
    	}
    	if (lines[3].slice(0,1)!="R") {
    		alert("NOT R!");
    		return;
    	}
    	if (lines[4].slice(0,1)!="#") {
    		alert("NOT #!");
    		return;
    	}
    	
    	//Ok, sanity checks passed, let's go!
    	var bout={
    		team1:{
    			name:"",
    			teamId: "",
    			teamList: []
    		},
    		team2:{
    			name:"",
    			teamId: "",
    			teamList: []
    		},
    		date:""
    	};

    	//Bout date:
    	bout.date=lines[2].split("\t")[0];

    	bout.team1.name=lines[4].split("\t")[1];
    	bout.team2.name=lines[26].split("\t")[1];

    	properties=[
    		"number"
    		,"name"
    		,"jmrJams" //jams skated as a jammer
    		,"pivJams" //jams skated as a pivot
    		,"blJams" //jams skated as a blocker
    		,"totJams" //total jams skated
    		,"pcJams" //percentage of jams skated
    		,"ptsAsJmr"
    		,"ppjAsJmr"
    		,"lostLead"
    		,"lead"
    		,"called"
    		,"noPass"
    		,"leadPc" //%age of the time this player gained lead when jamming
    		,"leadPm" //....I actually don't know. Possibly points spread when lead
    		,"avgLeadPm" //not sure either. Possibly average point spread per jam when lead
    		,"ptsFor" //TOTAL points for
    		,"ptsAgainst" //TOTAL points against
    		,"ptsPm" //TOTAL points spread
    		,"jmrPm" //Points spread (+/-) as a jammer
    		,"jmrAvPm" //Average point spread per jam as a jammer
    		,"pivPm" //Point spread (+/-) as a pivot
    		,"pivAvPm" //Average point spread per jam as a pivot
    		,"blPm" //Point spread (+/-) as a blocker
    		,"blAvPm" //Average point spread per jam as a blocker
    		,"totAv" //total +/- average per jam played in any position
    		,"vtarFor"
    		,"vtarAg"
    		,"vtarPm"
    		,"vtarJmrAvgPm"
    		,"vtarPivAvgPm"
    		,"vtarBlAvgPm"
    		,"vtarAvgPmAll" //Total +/- spread averaged across all jams, all positions relative to team average
    		,"pens"
    		]
    	for (i=5; i<25; i++) {
    		curLine=lines[i].split("\t");
    		curPlayerObj={};
    		for (j=0; j<properties.length; j++) {
    			curPlayerObj[properties[j]]=curLine[j]
    		}
    		curPlayerObj.playerId="";
    		if (curPlayerObj.name!="") {
    			bout.team1.teamList.push(curPlayerObj)
    		}
    	}
    	for (i=27; i<46; i++) {
    		curLine=lines[i].split("\t");
    		curPlayerObj={};
    		for (j=0; j<properties.length; j++) {
    			curPlayerObj[properties[j]]=curLine[j]
    		}
    		curPlayerObj.playerId="";
    		if (curPlayerObj.name!="") {
    			bout.team2.teamList.push(curPlayerObj)
    		}
    	}

    	return bout;
    }


  });