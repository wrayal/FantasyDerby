angular.module('FantasyDerbyApp')
  .controller('WFTDAPopCtrl', function (Population,affiliatedTeams) {
    wftdaPopCtrl=this;

    wftdaPopCtrl.affiliatedTeams=affiliatedTeams;

    wftdaPopCtrl.leagueName="";
    wftdaPopCtrl.teamName="";
    wftdaPopCtrl.playerData=[];

    wftdaPopCtrl.rosterData;
    wftdaPopCtrl.errorText="";
    wftdaPopCtrl.processCharter=function() {
      wftdaPopCtrl.playerData=[];
      wftdaPopCtrl.errorText="";
      lines=wftdaPopCtrl.rosterData.split("\n");

      wftdaPopCtrl.leagueName=lines[0].charAt(0)+lines[0].slice(1).toLowerCase();
      wftdaPopCtrl.teamName=lines[1].charAt(0)+lines[1].slice(1,lines[1].length-6).toLowerCase();

      angular.forEach(wftdaPopCtrl.affiliatedTeams,function(leagueData){
        if (leagueData.leagueName==wftdaPopCtrl.leagueName) {
          wftdaPopCtrl.errorText="Already have a team: "+leagueData.leagueName+" - "+leagueData.teamName;
        }
      })

      for (i=lines.length-1; i>=0; i--) {
        if (lines[i]=="Position") break; //We've reached the end of the skaters
        
        if (!isNaN(lines[i].charAt(0) - parseFloat(lines[i].charAt(0)))) { //believe it or not this is a failsafe check for whether we have a number at the first character
          line=lines[i].split("\t")
          console.log("LINE:",line)
          wftdaPopCtrl.playerData.push({name: line[1],number: line[0]})
        }
      }
      wftdaPopCtrl.playerData.reverse();

    }//End of text processing

    wftdaPopCtrl.createDBEntries=function() {
      console.log("OK, let's do this....")
      Population.populateFromData(wftdaPopCtrl.leagueName,wftdaPopCtrl.teamName,"wftda",wftdaPopCtrl.playerData)
    }


  });