angular.module('FantasyDerbyApp')
  .controller('ProfileCtrl', function (profile,auth) {
    var profileCtrl=this;

    //If they already had a profile this will be loaded and nice when the page comes up
  	profileCtrl.profile=profile;
  	//Otherwise we need to populate it:
  	if (!profileCtrl.profile.displayName) {
		profileCtrl.profile.displayName="New User";
		dataObj={
			name: auth.displayName,
			email: auth.email,
			display: auth.photoURL
		}
		profileCtrl.profile.data=dataObj;
		profileCtrl.profile.isVisible=false;
		profileCtrl.profile.$save();
	}

  	profileCtrl.updateProfile=function() {
  		if (profileCtrl.profile.displayName=="New User") {
			profileCtrl.error="Must pick a username";
			profileCtrl.success="";
		} else {
			profileCtrl.profile.$save();
			profileCtrl.success="Success!";
			profileCtrl.error="";
		}
  	}
  });