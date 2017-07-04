angular.module('FantasyDerbyApp')
	.factory('Population',function(){
		//Reference for team database
		var teamRef=firebase.database().ref().child("teams");
		//and for players
		var playerRef=firebase.database().ref().child("players");
		//and a root one...
		var rootRef=firebase.database().ref();

		Population={
          populateFromData: function(recLeagueName,recTeamName,recAffiliation,recPlayerData) {
          	//This will contain all the info to eventually be written
          	var updates={};

          	//This is the team object 
          	teamObj={
          		leagueName: recLeagueName,
          		teamName: recTeamName,
          		affiliation: recAffiliation,
          		teamPlayers: []
          	}
          	teamKey=teamRef.push().key;
          	console.log("team key:",teamKey)

          	for (i=0; i<recPlayerData.length; i++) {
          		//So we get the key
          		curPlayerKey=playerRef.push().key;

          		//Create the palyer object
          		curPlayerObj={
          			name: recPlayerData[i].name,
          			number: recPlayerData[i].number,
          			team: teamKey,
          			teamName: teamObj.teamName,
          			owner: "none"
          		}

          		//Create the appropriate database update
          		updates['/players/'+curPlayerKey]=curPlayerObj;

          		//And add the reference to the player to the team object
          		teamObj.teamPlayers.push({
          			id: curPlayerKey,
          			name: recPlayerData[i].name,
          			number: recPlayerData[i].number
          		})
          	}

          	updates['/teams/'+teamKey]=teamObj;

          	console.log("Update data:",updates)
          	console.log("Pushing....")

          	console.log("GOT",rootRef.update(updates))

               //And now we incorporate it into the relevant affiliation list
               var affilObj={
                    leagueName: recLeagueName,
                    teamName: recTeamName 
               }
               console.log("OBJ IS",affilObj)
               firebase.database().ref().child("teamAffiliations").child(recAffiliation).child(teamKey).set(affilObj)

          }//end populateFromData()

        }//end Population

		return Population;
	})