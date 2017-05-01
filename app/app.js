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
  });
