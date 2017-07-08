angular.module('FantasyDerbyApp')
	.factory('Auth',function(firebase,$location,Users,$location,$firebaseAuth,$state){

		var Auth={
			login: function(){
                var provider = new firebase.auth.FacebookAuthProvider();
				$firebaseAuth().$signInWithPopup(provider).then(function(firebaseUser) {
    				//Ok, great, we logged in correctly.
    				//We have another onAuth function (in app.js) to handle generic login stuff
    				//Here we just need to see if they are a completely new user and act appropriately
    				//Now let's see if they already have an entry in the DB
    				Users.getProfile(firebaseUser.user.uid).$loaded().then(function(userDbData){
                        console.log("IN HERE",userDbData,userDbData.displayName)
    					if (userDbData.displayName==undefined) { //Nope! They're a new user - direct them to set a new name
    						console.log("NEW USER!!")
    						$state.go("profile")
    					} else { //Yep! They're an existing user
    						console.log("Old user...")
    					}
    				})
  				}).catch(function(error) {
  					//Damn, something failed. We should probably do something in this case....
    				console.log("Authentication failed:", error);
  				});
			},
			logout: function() {
				$firebaseAuth().$signOut();
                $state.go("home")
			},
            auth: $firebaseAuth()
		}


		return Auth;
	})