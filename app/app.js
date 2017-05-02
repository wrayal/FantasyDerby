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
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'home/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/profile', {
        templateUrl: 'Users/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profileCtrl',
        resolve: {
          auth: function($rootScope,$location) {
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
      .when('/frontPage', {
        templateUrl: 'competitions/frontPage.html',
        controller: 'FrontPageCtrl',
        controllerAs: 'frontPageCtrl',
        resolve: {
          competitionData: function(Competitions) {
            return Competitions;
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
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
