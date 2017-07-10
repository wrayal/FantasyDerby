angular.module('FantasyDerbyApp')
	.factory('Users',function($location,$firebaseObject){

		var usersRef=firebase.database().ref().child("users");

		var userPresRef = firebase.database().ref().child("presence");
		var amOnline = firebase.database().ref().child(".info/connected");
		
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
			},
			setOnline: function(uid) {
				amOnline.on('value',function(snapshot){
					if (snapshot.val()) {
						userPresRef.child(uid).onDisconnect().remove();
						userPresRef.child(uid).set(true);
					}
				})
			},
			getPresence: function(uid) {
				return $firebaseObject(userPresRef.child(uid))
			},
			getAllUsers: function() { //To be used sparingly - could be a lot of data!
				return $firebaseObject(usersRef);;
			}
		};


		return Users;
	})