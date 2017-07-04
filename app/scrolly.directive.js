angular.module('FantasyDerbyApp').directive('scrolly', [function() {
    return {
        //restrict: 'DIV',
        link: function(scope, element, attrs) {
            raw=element[0];
            console.log("Loading directive")

            element.bind('scroll', function() {
                //console.log('in scroll',raw.scrollTop,raw.offsetHeight,raw.scrollHeight,attrs);
                scope.$apply(attrs.scrolly);
            });
        }
    }
}]);