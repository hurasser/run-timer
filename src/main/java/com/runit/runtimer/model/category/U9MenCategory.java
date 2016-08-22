package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U9MenCategory implements ResultCategory {
    @Override
    public String getCategoryId() {
        return "U9Men";
    }

    @Override
    public String getCategoryName() {
        return "U9 Drenge";
    }

    @Override
    public String getTitle() {
        return "Resultater - U9 Drenge";
    }

    @Override
    public int getMinAge() {
        return 0;
    }

    @Override
    public int getMaxAge() {
        return 9;
    }

    @Override
    public Gender getGender() {
        return Gender.MALE;
    }
}
