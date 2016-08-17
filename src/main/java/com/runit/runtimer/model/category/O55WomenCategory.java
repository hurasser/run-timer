package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class O55WomenCategory implements ResultCategory {
    @Override
    public String getTitle() {
        return "Resultater - Kvinder 55+";
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
        return Gender.FEMALE;
    }
}
