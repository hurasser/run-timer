package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U12Category implements ResultCategory {
    @Override
    public String getTitle() {
        return "Resultater - U12";
    }

    @Override
    public int getMinAge() {
        return 0;
    }

    @Override
    public int getMaxAge() {
        return 12;
    }

    @Override
    public Gender getGender() {
        return null;
    }
}
