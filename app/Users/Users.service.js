angular.module('FantasyDerbyApp')
	.factory('Users',function($location,$firebaseObject){

		var usersRef=firebase.database().ref().child("users");
		
		var Users={
			getProfile: function(uid) {
				$firebaseObject(usersRef).$loaded().then(function(loadData){console.log("load data",loadData)})
				return $firebaseObject(usersRef.child(uid));
			}
		};


		return Users;
	})