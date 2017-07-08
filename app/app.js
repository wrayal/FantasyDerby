'use strict';

/**
 * @ngdoc overview
 * @name step1CreateRepoApp
 * @description
 * # step1CreateRepoApp
 *
 * Main module of the application.
 */
var fbConfig = {
  apiKey: "AIzaSyBaIzeJybF9CVyyiwdSYU7zm8vmXa9pnb0",
  authDomain: "fantasy-roller-derby.firebaseapp.com",
  databaseURL: "https://fantasy-roller-derby.firebaseio.com/",
  storageBucket: "fantasy-roller-derby.appspot.com",
  //messagingSenderId: "<SENDER_ID>",
};
firebase.initializeApp(fbConfig);


angular
  .module('FantasyDerbyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/main.html',
        controller: 'MainCtrl as mainCtrl'
      })
      .state('FAQ', {
        url: '/info/faq',
        templateUrl: 'home/info/FAQ.html'
      })
      .state('privacy', {
        url: '/info/privacy',
        templateUrl: 'home/info/privacy.html'
      })
      .state('rules', {
        url: '/info/rules',
        templateUrl: 'home/info/rules.html'
      })
      .state('links', {
        url: '/info/links',
        templateUrl: 'home/info/links.html'
      })
      .state('contact', {
        url: '/info/contact',
        templateUrl: 'home/info/contact.html',
        controller: 'ContactCtrl as contactCtrl',
        resolve: {
          profile: function(Users,Auth) {
            return Auth.auth.$requireSignIn().then(function(authData){
              return Users.getProfile(authData.uid).$loaded()
            })
          }
        }
      })
      .state('competitions', {
        url: '/comp/{cid}',
        template: '<ui-view/>',
        controller: 'CompetitionCtrl as competitionCtrl',
        abstract: true,
        resolve: {
          competitionID: function($stateParams) {
            return $stateParams.cid
          },
          competitionKeyData: function($stateParams,Competitions) {
            return Competitions.getKeyData($stateParams.cid).$loaded();
          },
          profile: function(Users,Auth) {
            return Auth.auth.$requireSignIn().then(function(authData){
              return Users.getProfile(authData.uid).$loaded()
            })
          },
          tournamentData: function(Tournaments,$stateParams) {
            return Tournaments.getAllTournaments($stateParams.cid).$loaded();
          }
        }
      })
      .state('competitions.player',{
        url: '/player/{pid}',
        templateUrl: 'players/player.html',
        controller: 'PlayerCtrl as playerCtrl',
        resolve: {
          //This checks whether the current user 'owns' this player
          isOwner: function(Auth,$stateParams,Players) {
            return Players.getPlayerOwner($stateParams.pid).$loaded().then(function(playerOwner){
                return Auth.auth.$requireSignIn().then(function(authData){
                  return playerOwner.$value==authData.uid //Compare database entry for player owner to this user's uid
                })
            })
          },
          playerData: function(Players,$stateParams) {
            return Players.getPlayerData($stateParams.pid)
          }
        }
      })
      .state('competitions.user',{
        url: '/user/{uid}',
        templateUrl: 'Users/user.html',
        controller: 'UserCtrl as userCtrl',
        resolve: {
          isVisible: function($stateParams,Users) {
            return Users.checkVisibility($stateParams.uid).$loaded().then(function(visData){
              return visData.$value
            });
          },
          data: function($stateParams,Users) {
            return Users.getProfile($stateParams.uid);
          },
          linkedSkaterProfile: function($stateParams,Users,Players) {
            return Users.getLinkedPlayer($stateParams.uid).$loaded().then(function(playerData){
              return Players.getPlayerOwner(playerData.$value).$loaded().then(function(ownerData){
                if (ownerData.$value==$stateParams.uid) {
                  return playerData.$value
                } else {
                  return 0
                }
              })
            })
          }
        }
      })
      .state('competitions.frontPage', {
        url: '/frontPage',
        templateUrl: 'competitions/frontPage.html',
        controller: 'FrontPageCtrl as frontPageCtrl',
        resolve: {
          competitionData: function(Competitions,Auth) {
            return Competitions;
          }
        }
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'Users/profile.html',
        controller: 'ProfileCtrl as profileCtrl',
        resolve: {
          auth: function(Auth,$location,Competitions) {
            return Auth.auth.$requireSignIn().catch(function(){
              $location.path("/") //If we aren't signed in, head home
            })
          },
          profile: function(Auth,Users) {
            return Auth.auth.$requireSignIn().then(function(authData){ //If we are indeed signed in, grab the auth data
              return Users.getProfile(authData.uid).$loaded()
            })
          }
        }
      })
      .state('mrdaPopulate', {
        url: '/mrdaPopulate',
        templateUrl: 'backend/populateFromMRDARoster.html',
        controller: 'MRDAPopCtrl as mrdaPopCtrl'
      })
      .state('wftdaPopulate', {
        url: '/wftdaPopulate',
        templateUrl: 'backend/populateFromWFTDARoster.html',
        controller: 'WFTDAPopCtrl as wftdaPopCtrl'
      })
      .state('narwhalParse', {
        url: '/narwhalParse',
        templateUrl: 'backend/narwhalParsing/narwhal.html',
        controller: 'NarwhalCtrl as narwhalCtrl'
      })
      .state('adminContact', {
        url: '/adminContact',
        templateUrl: 'backend/contact/adminContact.html',
        controller: 'AdminContactCtrl as adminContactCtrl'
      })
      .state('competitions.setCompInfo', {
        url: '/compInfo',
        templateUrl: 'backend/setCompetitionInfo.html',
        controller: 'SetCompCtrl as setCompCtrl',
        resolve: {
          compData: function($stateParams,Competitions) {
            return Competitions.fullCompData($stateParams.cid).$loaded();
          },
          shortCompList: function(Competitions) {
            return Competitions.completeSet
          },
          teamList: function(Teams,$stateParams) {
            return Teams.getAffiliatedTeams($stateParams.cid);
          }
        }
      })
      .state('competitions.joinLeague',{
        url: '/joinLeague',
        templateUrl: 'fantasyLeagues/joinLeague/joinLeague.html',
        controller: 'JoinLeagueCtrl as joinLeagueCtrl'
      })
      .state('competitions.joinDirect',{
        url: '/joinLeague/{lid}',
        templateUrl: 'fantasyLeagues/joinLeague/joinDirect.html',
        controller: 'JoinDirectCtrl as joinDirectCtrl',
        resolve: {
          leagueId: function($stateParams) {
            return $stateParams.lid;
          },
          leagueData: function(FantasyLeagues,$stateParams) {
            return FantasyLeagues.getLeagueCommonData($stateParams.lid,$stateParams.cid).$loaded();
          },
          profile: function(Auth,Users) {
            return Auth.auth.$requireSignIn().then(function(authData){ //If we are indeed signed in, grab the auth data
              return Users.getProfile(authData.uid).$loaded()
            })
          }
        }
      })
      .state('competitions.createLeague',{
        url: '/createLeague',
        templateUrl: 'fantasyLeagues/createLeague/createLeague.html',
        controller: 'CreateLeagueCtrl as createLeagueCtrl',
        resolve: {
          tournamentInfo: function(Tournaments,$stateParams) {
            return Tournaments.getAllTournaments($stateParams.cid).$loaded();//Let's get all the tournament info ready for league creation
            //This is a little overkill as it includes team lists but...ugh...denormalisation ftl.
          }
        }
      })
      .state('competitions.fantasyLeagues',{
        url: '/fantasyLeagues/{lid}',
        abstract: true,
        templateUrl: 'fantasyLeagues/index.html',
        controller: 'FantasyLeagueCtrl as fantasyLeagueCtrl',
        resolve: {
          leagueData: function(FantasyLeagues,$stateParams) {
            return FantasyLeagues.getCurrentLeagueData($stateParams.cid,$stateParams.lid).$loaded()
          }
        }
      })
      .state('competitions.fantasyLeagues.summary',{
        url: '',
        templateUrl: 'fantasyLeagues/leagueViews/summary.html'
      })
      .state('competitions.fantasyLeagues.admin',{
        url: '/admin',
        templateUrl: 'fantasyLeagues/leagueViews/adminView.html'
      })
      .state('competitions.fantasyLeagues.squads', {
        url: '/squads/{sid}',
        templateUrl: 'fantasyLeagues/leagueViews/squads.html',
        controller: 'SquadCtrl as squadCtrl',
        resolve: {
          squadData: function($stateParams,$firebaseObject,Auth) {
            return Auth.auth.$requireSignIn().then(function(authData){
              var leagueRef=firebase.database().ref().child("competitionFull").child($stateParams.cid).child("fantasyLeagues").child($stateParams.lid);
              return $firebaseObject(
                leagueRef.child("fantasyTeams").child(authData.uid).child($stateParams.sid)
              );
            })
          },
          selectionData: function($stateParams,$firebaseArray,Auth) {
            return Auth.auth.$requireSignIn().then(function(authData){
              var leagueRef=firebase.database().ref().child("competitionFull").child($stateParams.cid).child("fantasyLeagues").child($stateParams.lid);
              return $firebaseArray(
                leagueRef.child("fantasySelections").child(authData.uid).child($stateParams.sid)
              );
            })
          },
          fantasyTeams: function($stateParams,$firebaseObject,Auth) {
            return Auth.auth.$requireSignIn().then(function(authData){
              var leagueRef=firebase.database().ref().child("competitionFull").child($stateParams.cid).child("fantasyLeagues").child($stateParams.lid);
              return $firebaseObject(leagueRef.child("fantasyTeams"));
            })
          },
          draftOrder: function($stateParams,$firebaseObject,Auth) {
            return Auth.auth.$requireSignIn().then(function(authData){
              var leagueRef=firebase.database().ref().child("competitionFull").child($stateParams.cid).child("fantasyLeagues").child($stateParams.lid);
              return $firebaseObject(leagueRef.child("draftOrders").child($stateParams.sid));
            })
          }
        }
      })
      .state('competitions.teamList',{
        url: '/teamList/{listId}',
        templateUrl: 'teams/teamList.html',
        controller: 'TeamListCtrl as teamListCtrl',
        resolve: {
          teamData: function($stateParams,Teams) {
            var name="";
            var list=[];

            if ($stateParams.listId=="allComp") {
              name=null;
              list=Teams.getAffiliatedTeams($stateParams.cid);
            } else {
              name=$stateParams.listId;
              list=Teams.getTourTeams($stateParams.cid,$stateParams.listId)
            }

            var teamDataObj={
              teamName: name,
              teamList: list
            }
            return teamDataObj;
          }
        }
      })
      .state('competitions.teamView',{
        url: '/teamView/{teamId}',
        templateUrl: 'teams/teamView.html',
        controller: 'TeamViewCtrl as teamViewCtrl',
        resolve: {
          teamData: function($stateParams,Teams){
            return Teams.getTeamData($stateParams.teamId).$loaded();
          }
        }
      })

      $urlRouterProvider.otherwise('/');
  })
  .run(function(){
    


  });
