package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class AllRunnersCategory implements ResultCategory {

    @Override
    public String getCategoryId() {
        return "All";
    }

    @Override
    public String getCategoryName() {
        return "Alle";
    }

    @Override
    public String getTitle() {
        return "Resultater - Alle";
    }

    @Override
    public int getMinAge() {
        return 0;
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
