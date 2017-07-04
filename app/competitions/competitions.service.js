angular.module('FantasyDerbyApp')
	.factory('Competitions',function($location,$firebaseObject,$stateParams,$state){
		//Reference for all short form names
		var comShortRef=firebase.database().ref().child("competitionShort");
		var comFullRef=firebase.database().ref().child("competitionFull");

        //comFullRef=comFullRef=firebase.database().ref().child("competitionFull").child(subdomain);
        console.log("CID:",$stateParams)
		Competitions={
                menuName: function(whichCompetition) {
                	return $firebaseObject(comShortRef.child(whichCompetition).child("shortName"))
                }, //no human name here

                completeSet:$firebaseObject(comShortRef), //complete set of tournaments in short form

                updateCSS: function(whichCompetition) {
                	//Some unnecessarily convoluted code to make sure we update to the new style sheet
					//TODO: make sure this is called on page opening, not just on competition transition
					cssLinks=document.getElementsByTagName("link");
				    for (i=0; i<cssLinks.length; i++) {
				      //Grab the actual name - the part after the final slash
				      splitName=cssLinks[i].href.split("/");
				      name=splitName[splitName.length-1]
				      
				      console.log("NAMES:",name)
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
				      path+=whichCompetition
				      path+=".css";

				      var newlink = document.createElement("link");
				      newlink.setAttribute("rel", "stylesheet");
				      newlink.setAttribute("type", "text/css");
				      newlink.setAttribute("href", path);

				      var oldlink = document.getElementsByTagName("link").item(i);

				      console.log("Switching style to",path)
				      document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
				    }
                },

                switchCompetition: function(whichCompetition) {
					if (whichCompetition) $state.go('competitions.frontPage',{cid:whichCompetition})
					else $state.go('home');
                },

                getKeyData: function(whichCompetition) {
                	return $firebaseObject(comFullRef.child(whichCompetition).child("uniData"));
                },

                fullCompData: function(whichCompetition) {
                	return $firebaseObject(comFullRef.child(whichCompetition))
                }
            }


		return Competitions;
	})