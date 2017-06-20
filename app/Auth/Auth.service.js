angular.module('FantasyDerbyApp')
	.factory('Auth',function(firebase,$location,$rootScope,Users,$location,$firebaseAuth){

		var Auth={
			login: function(){
                var provider = new firebase.auth.FacebookAuthProvider();
				$rootScope.auth.$signInWithRedirect(provider).then(function(firebaseUser) {
    				//Ok, great, we logged in correctly.
    				//We have another onAuth function (in app.js) to handle generic login stuff
    				//Here we just need to see if they are a completely new user and act appropriately
    				//Now let's see if they already have an entry in the DB
    				Users.getProfile(firebaseUser.user.uid).$loaded().then(function(userDbData){
    					if (userDbData.displayName==undefined) { //Nope! They're a new user - direct them to set a new name
    						console.log("NEW USER!!")
    						$location.path("/profile")
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
				$rootScope.auth.$signOut();
                $location.path("/")
			},
            auth: $firebaseAuth()
		}


		return Auth;
	})