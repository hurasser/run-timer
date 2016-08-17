angular.module('runTimer').directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background': 'url(' + value +')no-repeat 50% 50%',
                'background-size' : 'contain'
            });
        });
    };
});