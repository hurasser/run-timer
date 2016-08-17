angular.module('runTimer').controller('AddRunnerController', ["$scope", "$rootScope", "$http", function ($scope, $rootScope, $http) {
    var self = this;
    var runner = $scope.ngDialogData.runner || {};
    $scope.addRunnerData = {id: runner.id, number: runner.number, firstName: runner.firstName, lastName: runner.lastName, age: runner.age, gender: runner.gender};

    self.save = function() {
        runner.number = $scope.addRunnerData.number;
        runner.firstName = $scope.addRunnerData.firstName;
        runner.lastName = $scope.addRunnerData.lastName;
        runner.age = $scope.addRunnerData.age;
        runner.gender = $scope.addRunnerData.gender;
        if (!runner.id) {
            $http.post("api/race/runner", runner).then(function(response) {
                $rootScope.$broadcast("event:runner:added", {runner: response.data});
                $scope.closeThisDialog('success')
            });
        } else {
            $http.put("api/race/runner/" + runner.id, runner).then(function() {
                $scope.closeThisDialog('success')
            });
        }
    };

    self.cancel = function() {
        $scope.closeThisDialog('cancel')
    };

    self.canSave = function() {
        return !!$scope.addRunnerData.number && !!$scope.addRunnerData.firstName && !!$scope.addRunnerData.lastName && !!$scope.addRunnerData.gender;
    };
}]);