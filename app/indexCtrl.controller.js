angular.module('FantasyDerbyApp')
  .controller('IndexCtrl', function($scope,$state, $location,Competitions,Auth,Users,$transitions,FantasyLeagues,$firebaseObject) {
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
    indexCtrl.authData=null;
    indexCtrl.profile=null;
    indexCtrl.contactMessagesUnread=null;
    firebase.auth().onAuthStateChanged(function(authData){
      indexCtrl.authData=authData;
      if (authData) {
        Users.getProfile(authData.uid).$loaded().then(function(profileData){
          indexCtrl.profile=profileData;
          indexCtrl.profile.$watch(function(){indexCtrl.updateMemberships()})
          indexCtrl.updateMemberships();
          Users.setOnline(authData.uid);
          indexCtrl.contactMessagesUnread=$firebaseObject(
            firebase.database().ref().child("contactMessages").child(authData.uid).child("unread").child("user")
          )
        })
      } else {
        indexCtrl.profile=null;
      }
    })

    indexCtrl.adminList={
      iWwEokR2zGUOIW4sSEMtjhx6ZEo2: true
    }
    indexCtrl.amAdmin=function() {
      if (indexCtrl.profile && indexCtrl.adminList[indexCtrl.profile.$id]) return true;
      else return false;
    }
    

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
    indexCtrl.tourData=null;
    

  	//Set which entry is active in the menu
  	indexCtrl.activeEntry="home";
    indexCtrl.activeSubentry="";
  	$transitions.onSuccess({}, function(trans) {

      //Grab the name passed by the fired event
      console.log("TRANS",trans.to().name)
      toName=trans.to().name;

      //And set indexCtrl.activeEntry to the appropriate value
		  if (toName=="home") {
		  	indexCtrl.activeEntry="home";
		  } else if (toName=="competitions.frontPage" || toName=="competitions.teamList") {
		  	indexCtrl.activeEntry="rosterInfo";
		  } else if (toName=="FAQ" || toName=="privacy" || toName=="contact" || toName=="rules" || toName=="links") {
		  	indexCtrl.activeEntry="info";
      } else if (toName.split(".")[1]=="fantasyLeagues" || toName.split(".")[1]=="joinLeague" || toName.split(".")[1]=="createLeague") {
        indexCtrl.activeEntry="fLeague"
      } else {
        indexCtrl.activeEntry="";
      }

      if (toName=="competitions.fantasyLeagues.summary") {
        indexCtrl.activeSubentry="summary";
      } else if (toName=="competitions.fantasyLeagues.squads") {
        indexCtrl.activeSubentry="squads";
      } else if (toName=="competitions.fantasyLeagues.admin") {
        indexCtrl.activeSubentry="admin"
      } else {
        indexCtrl.activeSubentry="";
      }

      //Some extra info for potential menu bar entries
      indexCtrl.inCompetition=false;
      indexCtrl.inLeague=false;
      indexCtrl.tourData=null;

      if (toName.split(".")[0]=="competitions") {
        indexCtrl.inCompetition=true;
        indexCtrl.competitionId=$state.params.cid;
        indexCtrl.nameToShow=Competitions.menuName($state.params.cid);
        indexCtrl.tourData=Tournaments.getAllTournaments($state.params.cid);
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