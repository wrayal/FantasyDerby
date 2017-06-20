angular.module('FantasyDerbyApp')
  .controller('IndexCtrl', function($scope, $rootScope,$state, $location,Competitions,Auth,Users,$transitions) {
  	indexCtrl=this;

  	//Sets up a name to display in the menu bar
  	indexCtrl.nameToShow=null;
  	/*if (Competitions.humanName) {
  		indexCtrl.nameToShow=Competitions.humanName;
  	}*/
    indexCtrl.fullSet=Competitions.completeSet;
    indexCtrl.competitionData=Competitions.competitionData;
    indexCtrl.subdomain=Competitions.subdom;



    //console.log("full set:",Competitions.completeSet)

    indexCtrl.login=Auth.login;
    indexCtrl.logout=Auth.logout;

    //Helper function to go to the right competition
    //Could conceivably be a service function but is only used here
    indexCtrl.goToCompo=function(whichCompo) {
      Competitions.switchCompetition(whichCompo)
    }

    indexCtrl.inCompetition=false;
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
      } else {
        indexCtrl.activeEntry="";
      }

      //Some extra info for potential menu bar entries
      indexCtrl.inCompetition=false;
      indexCtrl.inLeague=false;

      if (toName.split(".")[0]=="competitions") {
        indexCtrl.inCompetition=true;
        indexCtrl.nameToShow=Competitions.menuName($state.params.cid);
        Competitions.updateCSS($state.params.cid);
        //Realistically this is calling it way too often :(
        //we should only be calling on transition between competitions
        //It's easy to have an "if" statement here but there must be a *correct* way to do it...
      } else {
        Competitions.updateCSS("");
      }

    });

  });