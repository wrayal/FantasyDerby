angular.module('FantasyDerbyApp')
	.factory('Auth',function(firebase,$location,Users,$location,$firebaseAuth,$state,$firebaseObject,$location){

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
            requireAdmin: function(url) {
                return $firebaseAuth().$requireSignIn().then(function(authData){
                    return $firebaseObject(firebase.database().ref().child("admin").child("list")).$loaded().then(function(adminData){
                        if (adminData[authData.uid]) {
                            return true; //Yep they are an admin
                        }
                        else {
                            firebase.database().ref().child("admin").child("messages").push({
                                uid: authData.uid,
                                url: url
                            }) //Or not! Log this attempt...
                            $state.go('home')
                        }
                    });
                })
            },
            requireSubAdmin: function(url) {
                return $firebaseAuth().$requireSignIn().then(function(authData){
                    return $firebaseObject(firebase.database().ref().child("admin")).$loaded().then(function(adminData){
                        if (adminData.list[authData.uid] || adminData.subAdmin[authData.uid]) {
                            return true; //Yep they are an admin
                        }
                        else {
                            firebase.database().ref().child("admin").child("messages").push({
                                uid: authData.uid,
                                url: url
                            }) //Or not! Log this attempt...
                            $state.go('home')
                        }
                    });
                })
            },
            checkAdmin: function() {
                return $firebaseAuth().$requireSignIn().then(function(authData){
                    return $firebaseObject(firebase.database().ref().child("admin").child("list")).$loaded().then(function(adminData){
                        if (adminData[authData.uid]) {
                            return true; //Yep they are an admin
                        }
                        else {
                            return false;
                        }
                    });
                })
            },
            checkAdminOrSubadmin: function() {
                return $firebaseAuth().$requireSignIn().then(function(authData){
                    return $firebaseObject(firebase.database().ref().child("admin").child("list")).$loaded().then(function(adminData){
                        if (adminData[authData.uid]) {
                            return "admin"; //Yep they are an admin
                        }
                        else {
                            return $firebaseObject(firebase.database().ref().child("admin").child("subAdmin")).$loaded().then(function(adminData){
                                if (adminData[authData.uid]) {
                                    return "subAdmin"; //Yep they are a subAdmin
                                }
                            })
                        }
                    });
                })
            },
            auth: $firebaseAuth()
		}


		return Auth;
	})