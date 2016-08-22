angular.module('runTimer').controller('HomeController', ["$scope", "$rootScope", "$http", "$interval", "$timeout", function ($scope, $rootScope, $http, $interval, $timeout) {
    var self = this;
    var timer;
    var nextCategoryIndex = 0;
    var shouldGetCategories = true;

    self.sponsors = [
        {caption: 'Hovedsponsor', logoUrl: 'images/main-sponsor.png'},
        {caption: 'Nummersponsor', logoUrl: 'images/sponsor-logos/bayship.jpeg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/sportmaster.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/apotek.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/bertoni.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/cafe_stedet.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/delizioso.jpg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/dykkerbutikken.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/hn_gavekurve.jpeg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/intersport.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/pepitos.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/inspiration.jpeg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/klippestuen.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/koc_kebab.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/magnolia.jpg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/mr.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/s_import.jpg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/sams.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/asics.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/jyske_bank.svg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/oel.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/lavigna.png'}
    ];

    self.numberOfLatestResultsToShow = 10;
    self.runnersBetweenSponsors = 7;
    self.nextSponsorIndex = 0;

    function getResults() {
        $http.get('api/race/results', {params: {numberOfResults: self.numberOfLatestResultsToShow}}).then(function(response) {
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
        var sponsorIndex = (Math.floor((index + 1) / self.runnersBetweenSponsors) - 1) % self.sponsors.length;
        return self.sponsors[sponsorIndex];
    };

    self.getNextSponsor = function() {
        if (!self.sponsors || self.sponsors.length == 0) return null;
        var sponsor = self.sponsors[self.nextSponsorIndex];
        self.nextSponsorIndex = (self.nextSponsorIndex < self.sponsors.length + 1) ? self.nextSponsorIndex + 1 : 0;
        return sponsor;
    };

    self.getUnshownSponsors = function() {
        if (!$scope.appData.resultList) return [];
        var runnerCount = $scope.appData.resultList.length;
        var nextSponsorIndex = Math.floor((runnerCount) / self.runnersBetweenSponsors);
        if (nextSponsorIndex >= self.sponsors.length) {
            return [];
        } else {
            return self.sponsors.slice(nextSponsorIndex);
        }
    };

    self.resultScrollFinished = function() {
        $scope.appData.resultList = null;
        $timeout(getResultList, 1000);
    }

    self.setNumberOfLatestResults = function(count) {
        self.numberOfLatestResultsToShow = count;
    }
}]);
