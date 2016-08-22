angular.module('runTimer').controller('AppController', ["$scope", "$http", "$location", "$interval", "$timeout", "snapRemote", "timeService", function ($scope, $http, $location, $interval, $timeout, snapRemote, timeService) {
    var self = this;

    function updateTime() {
        $scope.time = timeService.getTime();
    }

    function checkRaceStarted() {
        $http.get('api/race/start').then(function(response) {
            if (response.data.isFinished || response.data.startTime) {
                $scope.appData.startTime = response.data.startTime;
                $scope.appData.isFinished = response.data.isFinished;
                timeService.init(response.data.startTime);
                $interval(updateTime, 50);
            } else {
                $timeout(checkRaceStarted, 5000);
            }
        });
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

    self.admin = function() {
        $location.path("admin");
        snapRemote.close();
    };

    checkRaceStarted();

    $scope.$on("event:race:started", function() { $interval(updateTime, 50) });
}]);
