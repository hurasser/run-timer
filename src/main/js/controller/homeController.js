angular.module('runTimer').controller('HomeController', ["$scope", "$http", "$interval", function ($scope, $http, $interval) {
    var self = this;
    var timer;
    var nextCategoryIndex = 0;

    self.sprintSponsors = [
        {caption: 'Spurtpræmie sponsor 1', logoUrl: 'images/sponsor-logos/sportsmaster.png'},
        {caption: 'Spurtpræmie sponsor 2', logoUrl: 'images/sponsor-logos/sportsmaster.png'},
        {caption: 'Spurtpræmie sponsor 3', logoUrl: 'images/sponsor-logos/sportsmaster.png'},
        {caption: 'Spurtpræmie sponsor 4', logoUrl: 'images/sponsor-logos/sportsmaster.png'},
        {caption: 'Hoved sponsor', logoUrl: 'images/main-sponsor.png'}
    ];

    function getResults() {
        $http.get('api/race/results').then(function(response) {
            $scope.appData.results = response.data;
        });
        $http.get('api/race/categoryResults/' + nextCategoryIndex).then(function(response) {
            $scope.appData.categoryResults = response.data;
            if (response.data != null && response.data.length > 0) {
                nextCategoryIndex = response.data[response.data.length -1].categoryIndex + 1;
            }
        });
    }

    timer = $interval(getResults, 10000);

    $scope.$on('$destroy', function() {
        $interval.cancel(timer);
    });

    getResults();

    $http.get('api/race/resultList').then(function(response) {
        $scope.appData.resultList = response.data;
    });

    self.getSponsorForIndex = function(index) {
        var sponsorIndex = (Math.floor((index + 1) / 10) - 1) % self.sprintSponsors.length;
        return self.sprintSponsors[sponsorIndex];
    }
}]);
