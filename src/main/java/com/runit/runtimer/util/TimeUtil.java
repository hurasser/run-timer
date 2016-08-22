package com.runit.runtimer.util;

public class TimeUtil {

    public static String formatTimeInMillis(int timeInMillis) {
        int days = (int)Math.floor(timeInMillis / 86400000);
        timeInMillis -= 86400000 * days;
        int hours = (int)Math.floor(timeInMillis / 3600000);
        timeInMillis -= 3600000 * hours;
        int minutes = (int)Math.floor(timeInMillis / 60000);
        timeInMillis -= 60000 * minutes;
        int seconds = (int)Math.floor(timeInMillis / 1000);
        return (days > 0 ? (days + " days ") : "") + (hours > 0 ? (hours + ":") : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
}
