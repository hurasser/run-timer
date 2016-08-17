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