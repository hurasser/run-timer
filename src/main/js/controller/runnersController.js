angular.module('runTimer').controller('RunnersController', ["$scope", "$http", "ngDialog", function ($scope, $http, ngDialog) {
    var self = this;

    $scope.runnersData = {editData: {}, sortByLastName: false};

    function showRunnerDialog(runner) {
        ngDialog.open({
            template: 'templates/add-runner.html',
            controller: 'AddRunnerController',
            controllerAs: 'arc',
            closeByDocument: false,
            showClose: false,
            data: {
                runner: runner
            }
        });
    }

    self.sortKey = 'number';

    self.editRunner = function(runner) {
        showRunnerDialog(runner);
    };

    self.showAddRunner = function() {
        showRunnerDialog(null);
    };

    self.sortBy = function(property) {
        if (property == 'name') {
            property = $scope.runnersData.sortByLastName ? 'lastName' : 'firstName';
        }
        if (self.sortKey == property) {
            self.sortKey = "-" + property;
        } else {
            self.sortKey = property;
        }
    };

    $scope.$on("event:runner:added", function(event, data) {
        $scope.appData.runners.push(data.runner);
    });

    $scope.$watch('runnersData.sortByLastName', function(newValue) {
        var oldProperty = !newValue ? 'lastName' : 'firstName';
        var newProperty = newValue ? 'lastName' : 'firstName';
        self.sortKey = self.sortKey.replace(oldProperty, newProperty);
    });

    $http.get('api/race/runners').then(function(response) {
        $scope.appData.runners = response.data;
    }, function(response) {
        //TODO: Prob. server connection error - should not happen at this point
    });
}]);
