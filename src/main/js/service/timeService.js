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