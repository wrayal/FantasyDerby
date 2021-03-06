angular.module('FantasyDerbyApp')
  .controller('MRDAPopCtrl', function (Population,affiliatedTeams) {
    mrdaPopCtrl=this;

    mrdaPopCtrl.leagueName="";
    mrdaPopCtrl.teamName="";
    mrdaPopCtrl.playerData=[];

    mrdaPopCtrl.affiliatedTeams=affiliatedTeams;

    mrdaPopCtrl.rosterData;
    mrdaPopCtrl.errorMessage="";
  	mrdaPopCtrl.processCharter=function() {
      mrdaPopCtrl.affiliatedTeams.$loaded().then(function(){
        mrdaPopCtrl.playerData=[];

        lines=mrdaPopCtrl.rosterData.split("\n");

        //Work out how many initial lines - tells us whether there is both a league name and a team name
        for (i=0; i<lines.length; i++) {
          if (lines[i]=="") break;
        }
        console.log(i);

        mrdaPopCtrl.leagueName=lines[0];
        mrdaPopCtrl.teamName=lines[0];
        if (i==4) { //Distinct team name provided
          mrdaPopCtrl.teamName=lines[1];
        }


        i=lines.length-1;
        for (;i>0;i--) {
          if (lines[i]=="") break;
          line=lines[i].split(" ");
          curName="";
          for (j=0; j<line.length-1; j++) {
            curName+=line[j]+" ";
          }
          mrdaPopCtrl.playerData.push({name: curName,number: line[line.length-1]})
        }
        mrdaPopCtrl.playerData.reverse();

        mrdaPopCtrl.errorMessage="";
        angular.forEach(mrdaPopCtrl.affiliatedTeams,function(curTeam,teamKey){
          if (curTeam.leagueName==mrdaPopCtrl.leagueName) {
            mrdaPopCtrl.errorMessage="DANGER! IT APPEARS THAT THIS TEAM IS ALREADY IN THE DATABASE!"
          }
        })
      })
  	}

  	mrdaPopCtrl.createDBEntries=function() {
  		console.log("OK, let's do this....")
  		Population.populateFromData(mrdaPopCtrl.leagueName,mrdaPopCtrl.teamName,"mrda",mrdaPopCtrl.playerData)
  	}


  });