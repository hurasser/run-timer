package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U18Category implements ResultCategory {
    @Override
    public String getTitle() {
        return "Resultater - U18";
    }

    @Override
    public int getMinAge() {
        return 0;
    }

    @Override
    public int getMaxAge() {
        return 18;
    }

    @Override
    public Gender getGender() {
        return null;
    }
}
