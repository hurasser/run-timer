angular.module('runTimer').directive('repeatDoneEvent', ["$rootScope", function($rootScope) {
    return {
        link : function(scope, elem, attrs) {
            if (scope.$last) {
                $rootScope.$broadcast(attrs.repeatDoneEvent);
            }
        }
    }
}]);
