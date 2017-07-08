angular.module('FantasyDerbyApp')
  .controller('AdminContactCtrl', function ($firebaseObject,Users) {
    adminContactCtrl=this;

    console.log("ADMIN CONTACT!")

    var contactRef=firebase.database().ref().child("contactMessages");
    adminContactCtrl.fullMessageList=$firebaseObject(contactRef);

    adminContactCtrl.unreadList=[];
    adminContactCtrl.readList=[];
    adminContactCtrl.userData={};

    adminContactCtrl.updateMessages=function(){
      newUnreadList=[];
      newReadList=[];
      angular.forEach(adminContactCtrl.fullMessageList,function(messageData,userKey){
        adminContactCtrl.userData[userKey]=Users.getProfile(userKey);
        if (messageData.unread && messageData.unread.admin) {
          newUnreadList.push(userKey)
        } else {
          newReadList.push(userKey)
        }
        adminContactCtrl.unreadList=newUnreadList;
        adminContactCtrl.readList=newReadList;
      })
    }
    adminContactCtrl.fullMessageList.$watch(function(messages){
      adminContactCtrl.updateMessages();
    })
    adminContactCtrl.fullMessageList.$loaded().then(function(messages){
      adminContactCtrl.updateMessages();
    })

    adminContactCtrl.readUser="";
    adminContactCtrl.unreadUser="";

    adminContactCtrl.userMessagesToShow="";
    adminContactCtrl.load=function(user) {
      adminContactCtrl.userMessagesToShow=user;
    }
    adminContactCtrl.loadRead=function() {
      if (adminContactCtrl.readUser) {
        adminContactCtrl.unreadUser="";
        adminContactCtrl.load(adminContactCtrl.readUser);
      }
    }
    adminContactCtrl.loadUnread=function() {
      if (adminContactCtrl.unreadUser) {
        adminContactCtrl.readUser="";
        adminContactCtrl.load(adminContactCtrl.unreadUser);
      }
    }
    
    adminContactCtrl.message="";
    adminContactCtrl.sendMessage=function(){
      messageObj={
        message: adminContactCtrl.message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        sender: "admin"
      }
      contactRef.child(adminContactCtrl.userMessagesToShow).push(messageObj)
      contactRef.child(adminContactCtrl.userMessagesToShow).child("unread").child("admin").set(false);
      contactRef.child(adminContactCtrl.userMessagesToShow).child("unread").child("user").set(true);
      adminContactCtrl.message="";
    }

    adminContactCtrl.markRead=function(){
      contactRef.child(adminContactCtrl.userMessagesToShow).child("unread").child("admin").set(false);
    }
  	
  });