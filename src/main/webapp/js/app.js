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

angular.module('runTimer').controller('AppController', ["$scope", "$http", function ($scope, $http) {
    var self = this;
}]);

angular.module('runTimer').controller('CheckInController', ["$scope", "$http", function ($scope, $http) {
    var self = this;
}]);

angular.module('runTimer').controller('HomeController', ["$scope", "$http", "$location", function ($scope, $http, $location) {
    var self = this;

    $scope.click = function() {
        $location.path("time");
    };
}]);

angular.module('runTimer').controller('StartTimeController', ["$scope", "$http", function ($scope, $http) {
    var self = this;
}]);

angular.module('runTimer').controller('TimeController', ["$scope", "$http", function ($scope, $http) {
    var self = this;
}]);
