angular.module('runTimer').directive('resultScroller', ['$timeout', function($timeout){
    return {
        restrict : 'A',
        scope : {
            scrollFinished: '&',
            elementContainerId: '@',
            isHidden: '='
        },
        link : function(scope, elem, attrs) {
            scope.isHidden = true;

            function fadeIn() {
                scope.isHidden = false;
                $timeout(initScroll, 5000);
            }

            function initScroll() {
                var elementContainerElement = angular.element("#" + scope.elementContainerId);
                var elementContainerHeight = elementContainerElement.height();
                var scrollerHeight = elem.height();
                elem.duScrollTop(elementContainerHeight - scrollerHeight, (elementContainerHeight - scrollerHeight) * 26, function(x) {return x}).then(waitForFadeOut);
            }

            function waitForFadeOut() {
                $timeout(fadeOut, 5000);
            }

            function fadeOut() {
                scope.isHidden = true;
                $timeout(resetScrollAndNotify, 5000);
            }

            function resetScrollAndNotify() {
                scope.scrollFinished();
            }

            scope.$on('event:rendering:resultList', function() {
                $timeout(fadeIn, 1000);
            });
        }
    }
}]);
