angular.module('FantasyDerbyApp')
  .controller('UserCtrl', function (isVisible,data,linkedSkaterProfile) {
    var userCtrl=this;

    //First we see if the user has set their profile to be viewable by others
    userCtrl.isVisible=false;
    if (isVisible=="true") userCtrl.isVisible=true;

    //Put their data somewhere the view can get at it
    userCtrl.userData=data;

    //And if they have a verified linked skater profile, hook it up]
    console.log("LSP",linkedSkaterProfile)
    userCtrl.linkedSkaterProfile=linkedSkaterProfile;

    console.log("IN USER CTRL",isVisible)
  });