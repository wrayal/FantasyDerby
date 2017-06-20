angular.module('FantasyDerbyApp')
  .controller('PlayerCtrl', function(isOwner,playerData,$firebaseObject,$scope) {
  	playerCtrl=this;

    playerCtrl.isOwner=isOwner;
    playerCtrl.playerData=playerData;
    storage=firebase.storage();
    
    console.log("Player data",playerData.$id)

    playerCtrl.headshotRef=storage.ref('playerPictures/'+(playerData.$id)+'.jpg');

    //This is "downloading" the photo - displaying it on the pace.
    //Surprisingly cumbersome!
    playerCtrl.headshotURL="";
    playerCtrl.getHeadshot=function(){ 
      playerCtrl.headshotRef.getDownloadURL().then(
        function (workedData){
          playerCtrl.headshotURL=workedData
          console.log("Worked",workedData)
          $scope.$apply()
        },
        function(failedData){
          console.log("Failed:",failedData)
        })
    }
    playerCtrl.getHeadshot();


    //This is the procedure for uploading a headshot
    playerCtrl.uploadError="";
    playerCtrl.uploadSuccess="";
    playerCtrl.newFile;
    playerCtrl.uploadPhoto=function() {
      console.log("Find me",playerCtrl.headshotRef,playerCtrl.newFile)

      if (playerCtrl.newFile.type!="image/jpeg") {
        playerCtrl.uploadSuccess="";
        playerCtrl.uploadError="Please use a .jpg file.";
        return;
      }

      var uploadTask = playerCtrl.headshotRef.put(playerCtrl.newFile)

      uploadTask.on('state_changed',function(snapshot){
        var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        playerCtrl.uploadError="";
        playerCtrl.uploadSuccess='Upload is ' + progress + "% done";
        $scope.$apply();
      },
      function(error) {
        playerCtrl.uploadError="Upload error: "+error;
        playerCtrl.uploadSuccess="";
      },function() {
        playerCtrl.uploadError="";
        playerCtrl.uploadSuccess="Success!";
        playerCtrl.getHeadshot();
      })
    }


  });