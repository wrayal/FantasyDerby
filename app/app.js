'use strict';

/**
 * @ngdoc overview
 * @name step1CreateRepoApp
 * @description
 * # step1CreateRepoApp
 *
 * Main module of the application.
 */
angular
  .module('FantasyDerbyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
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
