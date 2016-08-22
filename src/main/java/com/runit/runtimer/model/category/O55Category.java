package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class O55Category implements ResultCategory {
    @Override
    public String getCategoryId() {
        return "55+";
    }

    @Override
    public String getCategoryName() {
        return "55+";
    }

    @Override
    public String getTitle() {
        return "Resultater - 55+";
    }

    @Override
    public int getMinAge() {
        return 55;
    }

    @Override
    public int getMaxAge() {
        return 200;
    }

    @Override
    public Gender getGender() {
        return null;
    }
}
