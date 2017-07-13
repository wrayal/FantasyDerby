angular.module('FantasyDerbyApp')
.directive('windowDependent', ['$window', function ($window) {
    return {
        //restrict: 'DIV',
        link: function(scope, element, attrs) {
        	scope.windowWidth = $window.innerWidth 
            angular.element($window).bind('resize', function(){
        		scope.windowWidth = $window.innerWidth;
        		scope.$apply();
      		}); 
        }
    } 
 }]);