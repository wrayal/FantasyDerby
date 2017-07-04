angular.module('FantasyDerbyApp')
  .controller('CreateLeagueCtrl', function (FantasyLeagues,Users,Auth,tournamentInfo) {
    createLeagueCtrl=this;

  	console.log("LET'S CREATE A LEAGUE!")

    createLeagueCtrl.tournamentInfo=tournamentInfo;

    createLeagueCtrl.newLeague={
      uniData:{
        Commissioner: 0,
        isOpen: true,
        visible: true,
        status: "forming",
        name: ""
      },
      members:{
      },
      tournaments:{
      },
      fantasyTeams:{
      }
    }
    createLeagueCtrl.newLeague.fantasyTeams[competitionCtrl.profile.$id]={
      name:""
    }
    createLeagueCtrl.newLeague.members[competitionCtrl.profile.$id]=true;

    angular.forEach(tournamentInfo, function(value,key){
      console.log("GOT TOURNIE DATA",value)
      createLeagueCtrl.newLeague.tournaments[key]=true;
    })

    //Use this to dump their name into the league
    Auth.auth.$requireSignIn().then(function(authData){ //If we are indeed signed in, grab the auth data
      createLeagueCtrl.newLeague.uniData.Commissioner=authData.uid;
    })

    createLeagueCtrl.errorMessage="";

    createLeagueCtrl.createLeague = function() {
      console.log("Creating league....")
      createLeagueCtrl.errorMessage="";

      //Make sure they have a name allocated
      if (createLeagueCtrl.newLeague.uniData.name=="") {
        createLeagueCtrl.errorMessage="Please give your league a name"
        return;
      }

      if (createLeagueCtrl.newLeague.fantasyTeams[competitionCtrl.profile.$id].name=="") {
        createLeagueCtrl.errorMessage="Please give your team a name"
        return;
      }

      //Make sure the asynchronous call above finished (maybe this is lazy....)
      if (createLeagueCtrl.newLeague.uniData.Commissioner==0) {
        createLeagueCtrl.errorMessage="Struggling to find your User ID; please wait a second and try again or reload the page"
        return;
      }

      console.log("League:",createLeagueCtrl.newLeague)

      //If we're all good...
      FantasyLeagues.createLeague(createLeagueCtrl.newLeague,competitionCtrl.cid)


    }

  });