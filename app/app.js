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
        controller: 'MainCtrl as main'
      })
      .state('about', {
        url: '/about',
        //templateUrl: function($stateParams){console.log("PARAMS",$stateParams);return 'home/about.html'},
        templateUrl: 'home/about.html',
        controller: 'AboutCtrl as about'
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
            return Competitions.getKeyData($stateParams.cid);
          },
          profile: function(Users,Auth) {
            return Auth.auth.$requireSignIn().then(function(authData){
              return Users.getProfile(authData.uid).$loaded()
            })
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
          auth: function($rootScope,$location,Competitions) {
            return $rootScope.auth.$requireSignIn().catch(function(){
              $location.path("/") //If we aren't signed in, head home
            })
          },
          profile: function($rootScope,Users) {
            return $rootScope.auth.$requireSignIn().then(function(authData){ //If we are indeed signed in, grab the auth data
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
      .state('competitions.joinLeague',{
        url: '/joinLeague',
        templateUrl: 'fantasyLeagues/joinLeague.html',
        controller: 'JoinLeagueCtrl as joinLeagueCtrl'
      })
      .state('competitions.createLeague',{
        url: '/createLeague',
        templateUrl: 'fantasyLeagues/createLeague.html',
        controller: 'CreateLeagueCtrl as createLeagueCtrl'
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

      $urlRouterProvider.otherwise('/');
  })
  .run(function($rootScope,$firebaseAuth,Users){
    
    $rootScope.auth = $firebaseAuth();
    $rootScope.authData=null;

    $rootScope.rtprofile=null;

    $rootScope.auth.$onAuthStateChanged(function(authData){
      console.log("Auth data:",authData)
      $rootScope.authData=authData;
      if (authData) {
        Users.getProfile(authData.uid).$loaded().then(function(profileData){
          $rootScope.rtprofile=profileData;
        })
      } else {
        $rootScope.rtprofile=null;
      }
    })
    console.log("AUTH:",$rootScope.auth)

  });
