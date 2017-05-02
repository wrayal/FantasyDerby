angular.module('FantasyDerbyApp')
  .controller('IndexCtrl', function($scope, $rootScope, $location,Competitions,Auth,Users) {
  	indexCtrl=this;

  	//Sets up a name to display in the menu bar
  	indexCtrl.nameToShow=""
  	if (Competitions.humanName) {
  		indexCtrl.nameToShow=Competitions.humanName;
  	}

    indexCtrl.login=Auth.login;
    indexCtrl.logout=Auth.logout;

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