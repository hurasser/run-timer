angular.module('runTimer').controller('HomeController', ["$scope", "$http", "$location", function ($scope, $http, $location) {
    var self = this;

    $scope.click = function() {
        $location.path("time");
    };
}]);
