'use strict';
angular.module('runTimer', ['ngSanitize', 'ngRoute', 'ngAnimate', 'snap', 'ngDialog']);

angular.module('runTimer').config([ '$httpProvider', '$routeProvider', '$locationProvider', 'snapRemoteProvider', function($httpProvider, $routeProvider, $locationProvider, snapRemoteProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

    snapRemoteProvider.globalOptions = {
        touchToDrag:false,
        tapToClose:true
    };

    $routeProvider.when('/', {
        templateUrl : 'pages/home.html',
        controller : 'HomeController',
        controllerAs : 'hc'
    }).when('/check-in', {
        templateUrl : 'pages/check-in.html',
        controller : 'CheckInController',
        controllerAs : 'cc'
    }).when('/time', {
        templateUrl : 'pages/time.html',
        controller : 'TimeController',
        controllerAs : 'tc'
    }).when('/runners', {
        templateUrl : 'pages/runners.html',
        controller : 'RunnersController',
        controllerAs : 'rc'
    }).otherwise({
        redirectTo : '/'
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
} ]);

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

angular.module('runTimer').controller('CheckInController', ["$scope", "resultService", "timeService", function ($scope, resultService, timeService) {
    var self = this;

    self.checkInRunner = function() {
        if (!$scope.number) return;
        resultService.checkInRunner($scope.number, timeService.getTime());
        $scope.number = "";
    }
}]);

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

angular.module('runTimer').directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background': 'url(' + value +')no-repeat 50% 50%',
                'background-size' : 'contain'
            });
        });
    };
});
angular.module('runTimer').directive('formTextInput', [function() {
	return {
		templateUrl : 'templates/form-text-input.html',
		restrict : 'A',
		scope : {
			placeholder: '@',
			model: '=',
			canSubmit: '&',
			submit: '&'
		},
		link : function(scope, elem, attrs) {
			scope.inputType = 'password' in attrs ? "password" : "text";
			
			scope.handleEnterPress = function() {
				if (scope.canSubmit && scope.canSubmit() && scope.submit) {
					scope.submit();
				}					
			};
			
			scope.handleFocus = function($event) {
				$event.stopPropagation();
				if (scope.focus) return;
				scope.focusMe = true;
			}
		}
	}
}]);

angular.module('runTimer').filter('timeFormat', function() {
    return function(timeInMillis) {
        var days = Math.floor(timeInMillis / 86400000);
        timeInMillis -= 86400000 * days;
        var hours = Math.floor(timeInMillis / 3600000);
        timeInMillis -= 3600000 * hours;
        var minutes = Math.floor(timeInMillis / 60000);
        timeInMillis -= 60000 * minutes;
        var seconds = Math.floor(timeInMillis / 1000);
        return (days ? (days + " days ") : "") + (hours ? (hours + ":") : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    };
});
angular.module('runTimer').factory('resultService', ["$http", "$window", "$interval", function($http, $window, $interval) {
    var self = {};

    function sendCachedResults() {
        var resultCache = getResultCache();
        $window.localStorage.removeItem('RunTimerCache');
        if (resultCache && resultCache.length > 0) {
            $http.post("api/race/results", resultCache).then(function() {
                // Do nothing all is well
            }, function() {
                var newCache = getResultCache();
            });
        }
    }

    function getResultCache() {
        var cache = $window.localStorage['RunTimerCache'];
        if (cache) return JSON.parse(cache);
        return [];
    }

    function saveResultCache(results) {
        $window.localStorage['RunTimerCache'] = JSON.stringify(results);
    }

    self.checkInRunner = function(number, time) {
        var resultCache = getResultCache();
        resultCache.push({number: number, time: time});
        saveResultCache(resultCache);
    };

    $interval(sendCachedResults, 10000);

    return self;
}]);
angular.module('runTimer').factory('timeService', ["$window", function($window) {
    var self = {};

    function loadCalibration() {
        var cachedCalibrationString = $window.localStorage['RunTimerCalibration'];
        if (!cachedCalibrationString || isNaN(cachedCalibrationString)) return 0;
        return parseInt(cachedCalibrationString);
    }

    var startTime;
    var calibration = loadCalibration();
    
    self.init = function(raceStartTime) {
        startTime = raceStartTime;
    };

    self.resetCalibration = function() {
        calibration = 0;
        $window.localStorage.removeItem('RunTimerCalibration');
    };

    self.adjustTime = function(adjustment) {
        calibration += (adjustment);
        $window.localStorage['RunTimerCalibration'] = calibration;
    };

    self.getTime = function() {
        if (!startTime) return null;
        return moment().diff(startTime - calibration);
    };

    return self;
}]);