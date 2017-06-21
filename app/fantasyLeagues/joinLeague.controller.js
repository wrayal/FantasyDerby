angular.module('FantasyDerbyApp')
  .controller('JoinLeagueCtrl', function (FantasyLeagues,Users) {
    joinLeagueCtrl=this;

  	console.log("LET'S JOIN A LEAGUE!")

    //This will hold all the data we actually want to display to the screen
    joinLeagueCtrl.allData={};
    joinLeagueCtrl.allDataArray=[];

    //Here we get a list of all the leagues///
    joinLeagueCtrl.leagueList=FantasyLeagues.getAllLeaguesShort();
    joinLeagueCtrl.leagueList.$loaded().then(function(leagueList){
      //We iterate over all of them and grab the pertinent data from the database
      angular.forEach(leagueList, function(value,key){
        joinLeagueCtrl.allData[key]=FantasyLeagues.getLeagueCommonData(key);
        joinLeagueCtrl.allData[key].commissionerName="";
        //And then make a call to figure out the actual display name of the commissioner
        joinLeagueCtrl.allData[key].$loaded().then(function(leagueData){
          Users.getUsername(leagueData.Commissioner).$loaded().then(function(gotName){
            joinLeagueCtrl.allData[key].commissionerName=gotName.$value;
            joinLeagueCtrl.allDataArray.push(joinLeagueCtrl.allData[key]);
          })
        
        })
      })
    })


  });