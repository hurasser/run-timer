'use strict';
angular.module('runTimer', ['ngSanitize', 'ngRoute', 'ngAnimate', 'snap', 'ngDialog', 'duScroll']);

angular.module('runTimer').config([ '$httpProvider', '$routeProvider', '$locationProvider', 'snapRemoteProvider', function($httpProvider, $routeProvider, $locationProvider, snapRemoteProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

    snapRemoteProvider.globalOptions = {
        touchToDrag:false,
        tapToClose:true
    };

    $routeProvider.when('/', {
        templateUrl : 'pages/home.html',
        controller : 'HomeController',
        controllerAs : 'hc'
    }).when('/check-in', {
        templateUrl : 'pages/check-in.html',
        controller : 'CheckInController',
        controllerAs : 'cc'
    }).when('/time', {
        templateUrl : 'pages/time.html',
        controller : 'TimeController',
        controllerAs : 'tc'
    }).when('/runners', {
        templateUrl : 'pages/runners.html',
        controller : 'RunnersController',
        controllerAs : 'rc'
    }).otherwise({
        redirectTo : '/'
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
} ]);
