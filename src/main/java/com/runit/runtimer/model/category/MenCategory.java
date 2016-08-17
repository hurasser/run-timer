package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class MenCategory implements ResultCategory {
    @Override
    public String getTitle() {
        return "Resultater - Mænd";
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
        return Gender.MALE;
    }
}
