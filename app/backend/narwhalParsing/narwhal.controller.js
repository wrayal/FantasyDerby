angular.module('FantasyDerbyApp')
  .controller('NarwhalCtrl', function ($firebaseObject) {
    narwhalCtrl=this;

    console.log("NARWHALS YAY!")
    narwhalCtrl.messages=$firebaseObject(firebase.database().ref().child("narwhalMessages"));

    narwhalCtrl.delete=function(messageKey) {
        delete(narwhalCtrl.messages[messageKey])
        narwhalCtrl.messages.$save()
    }
    narwhalCtrl.addMessage=function(){
        narwhalCtrl.messages.$save().then(function(){
            firebase.database().ref().child("narwhalMessages").push("")
        })
    }
    narwhalCtrl.save=function() {
        narwhalCtrl.messages.$save()
    }
  });