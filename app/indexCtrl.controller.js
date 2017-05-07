angular.module('FantasyDerbyApp')
  .controller('IndexCtrl', function($scope, $rootScope, $location,Competitions,Auth,Users) {
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
      var currentHref=window.location.href;
      currentHref=currentHref.split("http://")[1]
      currentHref=currentHref.split("/")[0]
      firstDotPos=currentHref.indexOf(".");
      if (firstDotPos>0) currentHref=currentHref.slice(firstDotPos+1);
      if (whichCompo=="") currentHref="http://"+currentHref+"/#!/"
      else currentHref="http://"+whichCompo+"."+currentHref+"/#!/"
      window.location.href=currentHref;

    }


    cssLinks=document.getElementsByTagName("link");
    for (i=0; i<cssLinks.length; i++) {
      //Grab the actual name - the part after the final slash
      splitName=cssLinks[i].href.split("/");
      name=splitName[splitName.length-1]
      
      //Leave bootstrap alone!
      if (name=="bootstrap.css") {
        continue //Skip over this one
      }

      //construct the new path
      path="";
      for (j=0; j<splitName.length-1; j++) {
        path+=splitName[j]+"/";
      }
      path+="main";
      if (Competitions.humanName) {
        path+=indexCtrl.subdomain
      }
      path+=".css";

      var newlink = document.createElement("link");
      newlink.setAttribute("rel", "stylesheet");
      newlink.setAttribute("type", "text/css");
      newlink.setAttribute("href", path);

      var oldlink = document.getElementsByTagName("link").item(i);

      console.log("Switching style to",path)
      document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
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