angular.module('FantasyDerbyApp')
  .controller('IndexCtrl', function($scope, $rootScope,$state, $location,Competitions,Auth,Users,$transitions,FantasyLeagues) {
  	indexCtrl=this;

  	//Sets up a name to display in the menu bar
  	indexCtrl.nameToShow=null;

    //Ok, we ned to have data available
    indexCtrl.fullSet=Competitions.completeSet;
    indexCtrl.competitionData=Competitions.competitionData;
    indexCtrl.subdomain=Competitions.subdom;

    //Some firebase objects listing members of leagues
    indexCtrl.leagueMemberships={};
    indexCtrl.updateMemberships=function() {
      indexCtrl.leagueMemberships={};
      if (indexCtrl.inCompetition && indexCtrl.competitionId && indexCtrl.profile) {
        console.log("Updating membership lists")
        if (indexCtrl.profile.leagueMembership) {
          competitionListing=indexCtrl.profile.leagueMembership[indexCtrl.competitionId];
          if (competitionListing) {
            checkLeagues=competitionListing.asPlayer
            if (checkLeagues) {
              angular.forEach(checkLeagues,function(value,key){
                console.log("Setting ",key,FantasyLeagues.getLeagueMembership(indexCtrl.competitionId,key))
                indexCtrl.leagueMemberships[key]=FantasyLeagues.getLeagueMembership(indexCtrl.competitionId,key);
              })
           }
          }
        }
      }
    }

    //This makes the user's profile available
    indexCtrl.profile=null;
    firebase.auth().onAuthStateChanged(function(){
      Auth.auth.$requireSignIn().then(function(authData){
        console.log("Sorting shiz",authData)
        indexCtrl.profile=Users.getProfile(authData.uid);
        console.log("SETTING THE WATCH")
        indexCtrl.profile.$watch(function(){console.log("IN THE WATCH!");indexCtrl.updateMemberships()})

        Users.setOnline(authData.uid);
      }).catch(function(){});
    })
    

    //This provides convenient login/logout functiona access
    indexCtrl.login=Auth.login;
    indexCtrl.logout=Auth.logout;

    //Helper function to go to the right competition
    indexCtrl.goToCompo=function(whichCompo) {
      Competitions.switchCompetition(whichCompo)
    }

    //Some helpful little details for formatting and such
    indexCtrl.inCompetition=false;
    indexCtrl.competitionId=null;
    indexCtrl.inLeague=false;
    

  	//Set which entry is active in the menu
  	indexCtrl.activeEntry="home";
  	$transitions.onSuccess({}, function(trans) {

      //Grab the name passed by the fired event
      console.log("TRANS",trans.to().name)
      toName=trans.to().name;

      //And set indexCtrl.activeEntry to the appropriate value
		  if (toName=="home") {
		  	indexCtrl.activeEntry="home";
		  } else if (toName=="competitions.frontPage") {
		  	indexCtrl.activeEntry="frontPage";
		  } else if (toName=="about") {
		  	indexCtrl.activeEntry="about";
      } else if (toName.split(".")[1]=="fantasyLeagues" || toName.split(".")[1]=="joinLeague" || toName.split(".")[1]=="createLeague") {
        indexCtrl.activeEntry="fLeague"
      } else {
        indexCtrl.activeEntry="";
      }

      //Some extra info for potential menu bar entries
      indexCtrl.inCompetition=false;
      indexCtrl.inLeague=false;

      if (toName.split(".")[0]=="competitions") {
        indexCtrl.inCompetition=true;
        indexCtrl.competitionId=$state.params.cid;
        indexCtrl.nameToShow=Competitions.menuName($state.params.cid);
        indexCtrl.updateMemberships();
        Competitions.updateCSS($state.params.cid);
        //Realistically this is calling it way too often :(
        //we should only be calling on transition between competitions
        //It's easy to have an "if" statement here but there must be a *correct* way to do it...
      } else {
        Competitions.updateCSS("");
        indexCtrl.nameToShow=null;
        
      }

    });

  });