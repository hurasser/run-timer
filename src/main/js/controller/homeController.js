angular.module('runTimer').controller('HomeController', ["$scope", "$rootScope", "$http", "$interval", "$timeout", function ($scope, $rootScope, $http, $interval, $timeout) {
    var self = this;
    var timer;
    var nextCategoryIndex = 0;
    var shouldGetCategories = true;

    self.sprintSponsors = [
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/sportsmaster.png'},
        {caption: 'Nummersponsor', logoUrl: 'images/sponsor-logos/bayship.jpeg'},
        {caption: 'Hovedsponsor', logoUrl: 'images/main-sponsor.png'}
    ];

    function getResults() {
        $http.get('api/race/results').then(function(response) {
            $scope.appData.results = response.data;
        });
        // We only update categories every 2nd time
        if (shouldGetCategories) {
            shouldGetCategories = false;
            $http.get('api/race/categoryResults/' + nextCategoryIndex).then(function(response) {
                $scope.appData.categoryResults = response.data;
                if (response.data != null && response.data.length > 0) {
                    nextCategoryIndex = response.data[response.data.length -1].categoryIndex + 1;
                }
            });
        } else {
            shouldGetCategories = true;
        }
    }

    function getResultList() {
        $http.get('api/race/resultList').then(function (response) {
            $scope.appData.resultList = response.data;
            if (response.data.length == 0) {
                // Manually declare rendering done, since there are no elements. Use timeout to give directive time to initialize
                $timeout(function() {$rootScope.$broadcast('event:rendering:resultList')}, 100);
            }
        });
    }
    timer = $interval(getResults, 5000);

    $scope.$on('$destroy', function() {
        $interval.cancel(timer);
    });

    getResults();
    getResultList();

    self.getSponsorForIndex = function(index) {
        var sponsorIndex = (Math.floor((index + 1) / 10) - 1) % self.sprintSponsors.length;
        return self.sprintSponsors[sponsorIndex];
    };

    self.getUnshownSponsors = function() {
        if (!$scope.appData.resultList) return [];
        var runnerCount = $scope.appData.resultList.length;
        var nextSponsorIndex = Math.floor((runnerCount) / 10);
        if (nextSponsorIndex >= self.sprintSponsors.length) {
            return [];
        } else {
            return self.sprintSponsors.slice(nextSponsorIndex);
        }
    };

    self.resultScrollFinished = function() {
        $scope.appData.resultList = null;
        $timeout(getResultList, 1000);
    }
}]);
