angular.module('FantasyDerbyApp')
  .controller('ContactCtrl', function ($firebaseObject,profile) {
    contactCtrl=this;

    contactCtrl.userId=profile.$id;
    var contactRef=firebase.database().ref().child("contactMessages").child(contactCtrl.userId);

    contactCtrl.messageList=$firebaseObject(contactRef);

    contactRef.child("unread").child("user").set(false);

   	contactCtrl.message="";
   	contactCtrl.sendMessage=function(){
   		messageObj={
   			message: contactCtrl.message,
   			timestamp: firebase.database.ServerValue.TIMESTAMP,
   			sender: "user"
   		}
   		contactRef.push(messageObj)
   		contactRef.child("unread").child("admin").set(true);
      contactCtrl.message="";
   	}
  	
  });