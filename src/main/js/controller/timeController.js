angular.module('runTimer').controller('TimeController', ["$scope", "$rootScope", "$http", "timeService", function ($scope, $rootScope, $http, timeService) {
    var self = this;

    self.startRace = function() {
        $scope.raceStarting = true;
        $http.post('api/race/start', {}).then(function() {
            $http.get('api/race/start').then(function(response) {
                $scope.raceStarting = false;
                if (response.data.startTime) {
                    $scope.appData.startTime = response.data.startTime;
                    timeService.init(response.data.startTime);
                    timeService.resetCalibration();
                    $rootScope.$broadcast("event:race:started");
                }
            });
        })
    };

    self.adjustTime = function(adjustment) {
        timeService.adjustTime(adjustment * 1000);
    };
    
    self.reset = function() {
        timeService.resetCalibration();
    };
}]);
