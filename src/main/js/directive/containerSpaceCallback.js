angular.module('runTimer').directive('containerSpaceCallback', [function() {
    return {
        restrict : 'A',
        scope : {
            containerSpaceCallback: '&',
            elementSize: '@'
        },
        link : function(scope, elem, attrs) {
            var elementSize = parseInt(scope.elementSize);
            if (isNaN(elementSize)) {
                elementSize = 30;
            }
            scope.containerSpaceCallback({count: Math.floor(elem.height() / elementSize)});
        }
    }
}]);
