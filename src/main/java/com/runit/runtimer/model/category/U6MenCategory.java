package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U6MenCategory implements ResultCategory {
    @Override
    public String getCategoryId() {
        return "U6Men";
    }

    @Override
    public String getCategoryName() {
        return "U6 Drenge";
    }

    @Override
    public String getTitle() {
        return "Resultater - U6 Drenge";
    }

    @Override
    public int getMinAge() {
        return 0;
    }

    @Override
    public int getMaxAge() {
        return 6;
    }

    @Override
    public Gender getGender() {
        return Gender.MALE;
    }
}
