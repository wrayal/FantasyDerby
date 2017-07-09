angular.module('FantasyDerbyApp')
	.factory('BlogMessages',function($firebaseObject,$firebaseObject){
		var blogRef=firebase.database().ref().child("blogMessages");

		var BlogMessages={
			getBlogData: function(blogId) {
				return $firebaseObject(blogRef.child(blogId));
			},
			commitPost: function(blogId,message) {
				key=blogRef.child(blogId).push(message);
				console.log("KEY",key.getKey())
			},
			deletePost: function(blogId,messageId) {
				blogRef.child(blogId).child(messageId).remove();

			}
		};

		return BlogMessages;
	})