'use strict';
angular.module('runTimer', [ 'ngSanitize', 'ngRoute', 'ngAnimate']);

angular.module('runTimer').config([ '$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

    $routeProvider.when('/', {
        templateUrl : 'partials/home.html',
        controller : 'HomeController'
    }).when('/check-in', {
        templateUrl : 'partials/check-in.html',
        controller : 'CheckInController'
    }).when('/time', {
        templateUrl : 'partials/time.html',
        controller : 'TimeController'
    }).when('/start-time', {
        templateUrl : 'partials/start-time.html',
        controller : 'StartTimeController'
    }).otherwise({
        redirectTo : '/'
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
} ]);
