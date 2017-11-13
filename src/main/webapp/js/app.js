'use strict';
angular.module('runTimer', ['ngSanitize', 'ngRoute', 'ngAnimate', 'snap', 'ngDialog', 'duScroll']);

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
    }).when('/admin', {
        templateUrl : 'pages/admin.html',
        controller : 'AdminController',
        controllerAs : 'ac'
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
    $scope.appData = {title: "Åbyhøjløbet 2017"};

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

angular.module('runTimer').controller('CheckInController', ["$scope", "resultService", "timeService", function ($scope, resultService, timeService) {
    var self = this;

    self.checkInRunner = function() {
        if (!$scope.number) return;
        resultService.checkInRunner($scope.number, timeService.getTime());
        $scope.number = "";
    }
}]);

angular.module('runTimer').controller('HomeController', ["$scope", "$rootScope", "$http", "$interval", "$timeout", function ($scope, $rootScope, $http, $interval, $timeout) {
    var self = this;
    var timer;
    var nextCategoryIndex = 0;
    var shouldGetCategories = true;

    self.sponsors = [
        {caption: 'Hovedsponsor', logoUrl: 'images/main-sponsor.png'},
        {caption: 'Nummersponsor', logoUrl: 'images/sponsor-logos/bayship.jpeg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/sportmaster.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/apotek.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/bertoni.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/cafe_stedet.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/delizioso.jpg'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/dykkerbutikken.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/hn_gavekurve.jpeg'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/intersport.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/pepitos.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/inspiration.jpeg'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/klippestuen.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/koc_kebab.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/magnolia.jpg'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/mr.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/s_import.jpg'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/sams.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/asics.png'},
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/jyske_bank.svg'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/oel.png'},
        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/danske_bank_logo.png'}
//        {caption: 'Spurtpræmie sponsor', logoUrl: 'images/sponsor-logos/lavigna.png'}
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
angular.module('runTimer').directive('containerSpaceCallback', [function() {
    return {
        restrict : 'A',
        scope : {
            containerSpaceCallback: '&',
            elementSize: '@'
        },
        link : function(scope, elem, attrs) {
            var elementSize = parseInt(scope.elementSize);
            if (isNaN(elementSize)) {
                elementSize = 30;
            }
            scope.containerSpaceCallback({count: Math.floor(elem.height() / elementSize)});
        }
    }
}]);

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

angular.module('runTimer').directive('repeatDoneEvent', ["$rootScope", function($rootScope) {
    return {
        link : function(scope, elem, attrs) {
            if (scope.$last) {
                $rootScope.$broadcast(attrs.repeatDoneEvent);
            }
        }
    }
}]);

angular.module('runTimer').directive('resultScroller', ['$timeout', function($timeout){
    return {
        restrict : 'A',
        scope : {
            scrollFinished: '&',
            elementContainerId: '@',
            isHidden: '='
        },
        link : function(scope, elem, attrs) {
            scope.isHidden = true;

            function fadeIn() {
                scope.isHidden = false;
                $timeout(initScroll, 5000);
            }

            function initScroll() {
                var elementContainerElement = angular.element("#" + scope.elementContainerId);
                var elementContainerHeight = elementContainerElement.height();
                var scrollerHeight = elem.height();
                elem.duScrollTop(elementContainerHeight - scrollerHeight, (elementContainerHeight - scrollerHeight) * 26, function(x) {return x}).then(waitForFadeOut);
            }

            function waitForFadeOut() {
                $timeout(fadeOut, 5000);
            }

            function fadeOut() {
                scope.isHidden = true;
                $timeout(resetScrollAndNotify, 5000);
            }

            function resetScrollAndNotify() {
                scope.scrollFinished();
            }

            scope.$on('event:rendering:resultList', function() {
                $timeout(fadeIn, 1000);
            });
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

    $interval(sendCachedResults, 5000);

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