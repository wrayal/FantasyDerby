angular.module('FantasyDerbyApp')
  .controller('IndexCtrl', function($scope, $rootScope,$state, $location,Competitions,Auth,Users,$transitions) {
  	indexCtrl=this;

  	//Sets up a name to display in the menu bar
  	indexCtrl.nameToShow=""
  	if (Competitions.humanName) {
  		indexCtrl.nameToShow=Competitions.humanName;
  	}
    indexCtrl.fullSet=Competitions.completeSet;
    indexCtrl.competitionData=Competitions.competitionData;
    indexCtrl.subdomain=Competitions.subdom;



    //console.log("full set:",Competitions.completeSet)

    indexCtrl.login=Auth.login;
    indexCtrl.logout=Auth.logout;

    //Helper function to go to the right competition
    //Could conceivably be a service function but is only used here
    indexCtrl.goToCompo=function(whichCompo) {
      /*var currentHref=window.location.href;
      currentHref=currentHref.split("http://")[1]
      currentHref=currentHref.split("/")[0]
      firstDotPos=currentHref.indexOf(".");
      if (firstDotPos>0) currentHref=currentHref.slice(firstDotPos+1);
      if (whichCompo=="") currentHref="http://"+currentHref+"/#!/"
      else currentHref="http://"+whichCompo+"."+currentHref+"/#!/"
      window.location.href=currentHref;*/
      Competitions.switchCompetition(whichCompo)
    }


  	//Set which entry is active in the menu
  	indexCtrl.activeEntry="home";
  	$transitions.onSuccess({}, function(trans) {

      //Grab the name passed by the fired event
      console.log("TRANS",trans.to().name)
      toName=trans.to().name;

      //And set indexCtrl.activeEntry to the appropriate value
		  if (toName=="home") {
		  	indexCtrl.activeEntry="home";
		  } else if (toName=="frontPage") {
		  	indexCtrl.activeEntry="frontPage";
		  } else if (toName=="about") {
		  	indexCtrl.activeEntry="about";
		  } else {
        indexCtrl.activeEntry="";
      }

    });

  });