angular.module('FantasyDerbyApp')
	.factory('Users',function($location,$firebaseObject){

		var usersRef=firebase.database().ref().child("users");
		
		var Users={
			getProfile: function(uid) {
				return $firebaseObject(usersRef.child(uid));
			},
			checkVisibility: function(uid) {
				return $firebaseObject(usersRef.child(uid).child("isVisible"));
			},
			getLinkedPlayer: function(uid) {
				return $firebaseObject(usersRef.child(uid).child("linkedPlayer"));
			},
			getUsername: function(uid) {
				return $firebaseObject(usersRef.child(uid).child("displayName"))
			}
		};


		return Users;
	})