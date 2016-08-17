angular.module('runTimer').controller('AppController', ["$scope", "$http", "$location", "$interval", "snapRemote", "timeService", function ($scope, $http, $location, $interval, snapRemote, timeService) {
    var self = this;

    function updateTime() {
        $scope.time = timeService.getTime();
    }

    $scope.appData = {title: "Åbyhøjløbet 2016"};

    self.home = function() {
        $location.path("");
        snapRemote.close();
    };

    self.time = function() {
        $location.path("time");
        snapRemote.close();
    };

    self.checkIn = function() {
        $location.path("check-in");
        snapRemote.close();
    };

    self.runners = function() {
        $location.path("runners");
        snapRemote.close();
    };

    $http.get('api/race/start').then(function(response) {
        if (response.data.startTime) {
            $scope.appData.startTime = response.data.startTime;
            timeService.init(response.data.startTime);
            $interval(updateTime, 50);
        }
    });

    $scope.$on("event:race:started", function() { $interval(updateTime, 50) });
}]);
