angular.module('FantasyDerbyApp')
  .controller('MainCtrl', function ($firebaseArray,$firebaseObject,Auth) {
    mainCtrl=this;

    mainCtrl.narwhalMessage;

    Auth.auth.$requireSignIn().then(function(){
    	console.log("AM IN")
    	$firebaseArray(firebase.database().ref().child("narwhalMessages")).$loaded().then(function(narData){
    		narLength=0;
    		angular.forEach(narData,function(){
    			narLength++;
    		})
    		console.log("Nar data",narLength)
    		whichMessage=Math.floor(narLength*Math.random())
    		if (whichMessage==narLength) whichMessage=narLength-1;
    		mainCtrl.narwhalMessage=narData[whichMessage];
    	})
    }).catch(function(){
    	mainCtrl.narwhalMessage={$value:"Yes that's the glorious form of the mythical narwhal."}
    })
    
  });
