angular.module('FantasyDerbyApp')
	.factory('Squads',function($location,$firebaseObject,$stateParams,$state){

		//Note code out here is only run on service instantiation
		//Not, e.g. on switching to a new competition

		Squads={
			saveSelection: function(cid,lid,uid,tid,selectionData) {
				var competitionRef=firebase.database().ref().child("competitionFull").child(cid);
				var leagueRef=competitionRef.child("fantasyLeagues").child(lid);
                var selectionRef=leagueRef.child("fantasySelections").child(uid).child(tid);
                console.log(cid,lid,uid,tid,selectionData,selectionRef)
                selectionRef.set(angular.fromJson(angular.toJson(selectionData)));
			},
			getSelection: function(cid,lid,uid,tid) {
				var competitionRef=firebase.database().ref().child("competitionFull").child(cid);
				var leagueRef=competitionRef.child("fantasyLeagues").child(lid);
                var selectionRef=leagueRef.child("fantasySelections").child(uid).child(tid);
                return $firebaseObject(selectionRef);
			},
			setLeagueToDrafting: function(uid,cid,lid,tournamentList) {
				//First we grab the data we need and load it
				var competitionRef=firebase.database().ref().child("competitionFull").child(cid);
				var leagueRef=competitionRef.child("fantasyLeagues").child(lid);
				$firebaseObject(leagueRef).$loaded().then(function(leagueData){
					console.log("Got league data",leagueData)
					//And now we need to:
					// 1) Set the league status to "drafting"
					// 2) Create an (initially blank) fantasy squad for each user for each tournament
					// 3) Create drafting orders for each tournament

					// 1) Set league to drafting
					leagueRef.child("uniData").child("status").set("drafting")

					// 2) Create fantasy squads
					var memberRef=leagueRef.child("members");
					//Grab the member data
					membArr=[];
					memberRef.once('value').then(function(members){
						memberList=members.val();
						//Loop over each member
						angular.forEach(memberList,function(value,key){
							//And if they have been accepted as members...
							console.log("CORRES:",key," -> ",value)
							if (value==true) {
								membArr.push(key);
								//...Let's create a squad for them
								squadObj={
									jammer:"",
									doubleThreat:"",
									blocker1:"",
									blocker2:"",
									blocker3:""
								}
								//And put it into the database
								angular.forEach(tournamentList,function(tournamentValue,tournamentKey) {
									leagueRef.child("fantasyTeams").child(key).child(tournamentKey).set(squadObj)
								})
							}
						})

						//3) Create drafting orders
						numTournaments=0;
						angular.forEach(tournamentList,function(tournament){
							numTournaments++;
						})
						skipNum=Math.ceil(numTournaments/membArr.length)
						if (skipNum==membArr.length) skipNum=membArr.length-1;
						if (skipNum==0) skipNum=1;
						console.log("SKIPPIN':",skipNum)
						angular.forEach(tournamentList,function(tournamentValue,tournamentKey){
							tempMem=membArr.shift();
							membArr=membArr.concat([tempMem]);
							leagueRef.child("draftOrders").child(tournamentKey).set(
								membArr.slice().concat(membArr.slice().reverse()).concat(membArr.slice()).concat(membArr.slice().reverse()).concat(membArr.slice())
								);
						})

					})
					console.log("membRef",memberRef)

				})
			},
			revertToFormation: function(cid,lid,tournamentList) {
				//First we grab the data we need and load it
				var competitionRef=firebase.database().ref().child("competitionFull").child(cid);
				var leagueRef=competitionRef.child("fantasyLeagues").child(lid);
				$firebaseObject(leagueRef).$loaded().then(function(leagueData){
					console.log("Got league data",leagueData)
					//And now we need to:
					// 1) Set the league status to "forming"
					// 2) Delete drafted squads
					// 3) Delete drafting orders

					// 1) Set league to drafting
					leagueRef.child("uniData").child("status").set("forming")

					// 2) Delete drafted squads
					var memberRef=leagueRef.child("members");
					//Grab the member data
					memberRef.once('value').then(function(members){
						memberList=members.val();
						//Loop over each member
						angular.forEach(memberList,function(value,key){
							//And if they have been accepted as members...
							if (value) {
								angular.forEach(tournamentList,function(tournamentValue,tournamentKey) {
									leagueRef.child("fantasyTeams").child(key).child(tournamentKey).set({})
								})
							}
						})
					})

					// 3) Delete drafting orders
					leagueRef.child("draftOrders").set({})
				})
			}
		}

		return Squads;
	})