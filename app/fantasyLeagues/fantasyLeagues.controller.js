angular.module('FantasyDerbyApp')
  .controller('FantasyLeagueCtrl', function (FantasyLeagues,leagueData,$transitions) {
    fantasyLeagueCtrl=this;
    fantasyLeagueCtrl.leagueData=leagueData; //Let's try to keep this predominantly for reading....

    //Marking the appropriate sub-menu entry active
  	fantasyLeagueCtrl.activeEntry="home";
  	$transitions.onSuccess({}, function(trans) {

  		/*
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
        indexCtrl.nameToShow=null;
        
      }
	*/
    });
  	
  });