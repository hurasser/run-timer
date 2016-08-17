angular.module('runTimer').controller('CheckInController', ["$scope", "resultService", "timeService", function ($scope, resultService, timeService) {
    var self = this;

    self.checkInRunner = function() {
        if (!$scope.number) return;
        resultService.checkInRunner($scope.number, timeService.getTime());
        $scope.number = "";
    }
}]);
