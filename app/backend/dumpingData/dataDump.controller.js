angular.module('FantasyDerbyApp')
  .controller('DataDumpCtrl', function (compData,playerData,userData) {
    dataDumpCtrl=this;

    dataDumpCtrl.compData=compData;
    dataDumpCtrl.parsedDump={};
    dataDumpCtrl.playerData=playerData;
    dataDumpCtrl.userData=userData;

    dataDumpCtrl.compData.$loaded().then(function(compData){
		console.log("FL DATA",compData.fantasyLeagues)
		angular.forEach(compData.fantasyLeagues,function(leagueData,leagueKey){
			angular.forEach(leagueData.fantasyTeams,function(usersSquads,userId) {
				angular.forEach(usersSquads,function(squadData,tournamentId){
					if (tournamentId!="name" && tournamentId!="score") {
						curSquad=squadData;
						if (curSquad.jammer || curSquad.doubleThreat || curSquad.blocker1 || curSquad.blocker2 || curSquad.blocker3) {
							if (!dataDumpCtrl.parsedDump[tournamentId]) {
								dataDumpCtrl.parsedDump[tournamentId]="Position\t Player name\t Team name\t User name\t Fantasy League name";
								dataDumpCtrl.parsedDump[tournamentId]+="\tPlayer Jammer score\tPlayer DT Score\tPlayer Blocker score\n"
							}

							positions=["jammer","doubleThreat","blocker1","blocker2","blocker3"]
							positionName=["Jammer","Double Threat","Blocker","Blocker","Blocker"]
							for (i=0; i<positions.length; i++) {
								position=positions[i];
								dataDumpCtrl.parsedDump[tournamentId]+=positionName[i];
								if (playerData[curSquad[position]]) {
									dataDumpCtrl.parsedDump[tournamentId]+="\t"+dataDumpCtrl.playerData[curSquad[position]].name
									dataDumpCtrl.parsedDump[tournamentId]+="\t"+dataDumpCtrl.playerData[curSquad[position]].teamName
									dataDumpCtrl.parsedDump[tournamentId]+="\t"+userData[userId].displayName
									dataDumpCtrl.parsedDump[tournamentId]+="\t"+leagueData.uniData.name
									if (compData.tournamentScoreData && compData.tournamentScoreData[tournamentId] && compData.tournamentScoreData[tournamentId].playerData) {
										curPlayerScores=compData.tournamentScoreData[tournamentId].playerData[curSquad[position]];
										if (curPlayerScores) {
											dataDumpCtrl.parsedDump[tournamentId]+="\t"+curPlayerScores.total["jmrFDScore"]
											dataDumpCtrl.parsedDump[tournamentId]+="\t"+curPlayerScores.total["dtFDScore"]
											dataDumpCtrl.parsedDump[tournamentId]+="\t"+curPlayerScores.total["blFDScore"]
										} else {
											dataDumpCtrl.parsedDump[tournamentId]+="\t0\t0\t0"
										}
									} else {
										dataDumpCtrl.parsedDump[tournamentId]+="\t0\t0\t0"
									}

									dataDumpCtrl.parsedDump[tournamentId]+="\n"
								} else {
									dataDumpCtrl.parsedDump[tournamentId]+="\t\t\n"
								}
							}
						}
					}
				})
			})
		})
		console.log("DONE",)
    })
  	
  });