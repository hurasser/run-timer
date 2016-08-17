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