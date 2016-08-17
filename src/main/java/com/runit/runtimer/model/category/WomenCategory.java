package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class WomenCategory implements ResultCategory {
    @Override
    public String getTitle() {
        return "Resultater - Kvinder";
    }

    @Override
    public int getMinAge() {
        return 0;
    }

    @Override
    public int getMaxAge() {
        return 0;
    }

    @Override
    public Gender getGender() {
        return null;
    }
}
