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
			setLeagueToDrafting: function(cid,lid) {
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
				})
			},
			revertToFormation: function(cid,lid) {
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
				})
			}
		}

		return Squads;
	})