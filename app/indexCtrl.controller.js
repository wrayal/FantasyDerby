angular.module('FantasyDerbyApp')
  .controller('IndexCtrl', function($scope, $rootScope, $location,Competitions,Auth,Users) {
  	indexCtrl=this;

  	//Sets up a name to display in the menu bar
  	indexCtrl.nameToShow=""
  	if (Competitions.humanName) {
  		indexCtrl.nameToShow=Competitions.humanName;
  	}
    indexCtrl.fullSet=Competitions.completeSet;

    //console.log("full set:",Competitions.completeSet)

    indexCtrl.login=Auth.login;
    indexCtrl.logout=Auth.logout;

    indexCtrl.goToCompo=function(whichCompo) {
      var currentHref=window.location.href;
      currentHref=currentHref.split("http://")[1]
      currentHref=currentHref.split("/")[0]
      firstDotPos=currentHref.indexOf(".");
      if (firstDotPos>0) currentHref=currentHref.slice(firstDotPos+1);
      if (whichCompo=="") currentHref="http://"+currentHref+"/#!/"
      else currentHref="http://"+whichCompo+"."+currentHref+"/#!/"
      window.location.href=currentHref;

    }

  	//Set which entry is active in the menu
  	indexCtrl.activeEntry="home";
  	$rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
		  if ($location.path()=="/") {
		  	indexCtrl.activeEntry="home";
		  } else if ($location.path()=="/frontPage") {
		  	indexCtrl.activeEntry="frontPage";
		  } else if ($location.path()=="/about") {
		  	indexCtrl.activeEntry="about";
		  } else {
        indexCtrl.activeEntry="";
      }

    });

  });