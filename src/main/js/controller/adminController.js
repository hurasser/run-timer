angular.module('runTimer').controller('AdminController', ["$scope", "$http", "$filter", function ($scope, $http, $filter) {
    var self = this;
    
    $scope.adminData = {};

    function performSearch(number) {
        $http.get('api/race/runnerResults', {params: {runnerNumber: number}}).then(function(response) {
            $scope.adminData.runnerResults = response.data;
        });
    }

    self.search = function() {
        if (!$scope.adminData.runnerNumber || isNaN($scope.adminData.runnerNumber)) return;
        $scope.adminData.runnersWithDuplicates = null;
        $scope.adminData.runnerResults = null;
        performSearch($scope.adminData.runnerNumber);
    };

    self.findDuplicates = function() {
        $scope.adminData.runnerResults = null;
        $http.get('api/race/runner/multipleResults').then(function(response) {
            $scope.adminData.runnersWithDuplicates = response.data;
        });
    };

    self.findNoResults = function() {
        $scope.adminData.runnerResults = null;
        $http.get('api/race/runner/noResult').then(function(response) {
            $scope.adminData.runnersWithDuplicates = response.data;
        });
    };

    self.getResultsForRunnerNumber = function(number) {
        $scope.adminData.runnersWithDuplicates = null;
        performSearch(number);
    };
    
    self.editNumber = function(result) {
        result.editingNumber = true;
        result.newNumber = result.number;
    };

    self.editTime = function(result) {
        result.editingTime = true;
        result.oldTime = $filter('timeFormat')(result.time);
        result.newTime = result.oldTime;
    };

    self.submitResult = function(result) {
        if (result.newNumber == result.number && result.newTime == result.oldTime) return;
        var timeInMillis = 0;
        var timePattern = /^\d?\d(:\d\d){0,2}$/;
        if (timePattern.test(result.newTime)) {
            var timeArray = result.newTime.split(":");
            var timeMultArray = [1000, 60000, 3600000];
            for (var i = 0; i< timeArray.length; i++) {
                timeInMillis += parseInt(timeArray[timeArray.length - (i + 1)]) * timeMultArray[i];
            }
        } else {
            timeInMillis = result.time;
        }
        $http.post('api/race/editResult', {id: result.id, number: result.newNumber || result.number, time: timeInMillis}).then(function(response) {
            var newResult = response.data;
            result.time = newResult.time;
            result.newTime = null;
            result.oldTime = null;
            result.name = newResult.name;
            result.number = newResult.number;
            result.newNumber = null;
            result.editingNumber = false;
            result.editingTime = false;
        });
    };

    self.deleteResult = function(result) {
        $http.delete('api/race/result/' + result.id).then(function() {
            var index = $scope.adminData.runnerResults.indexOf(result);
            if (index >= 0) {
                $scope.adminData.runnerResults.splice(index, 1);
            }
        });
    }
}]);