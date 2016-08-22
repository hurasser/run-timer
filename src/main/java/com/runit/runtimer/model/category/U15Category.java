package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U15Category implements ResultCategory {
    @Override
    public String getCategoryId() {
        return "U15";
    }

    @Override
    public String getCategoryName() {
        return "U15";
    }

    @Override
    public String getTitle() {
        return "Resultater - U15";
    }

    @Override
    public int getMinAge() {
        return 0;
    }

    @Override
    public int getMaxAge() {
        return 15;
    }

    @Override
    public Gender getGender() {
        return null;
    }
}
