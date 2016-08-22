package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U6WomenCategory implements ResultCategory {
    @Override
    public String getCategoryId() {
        return "U6Women";
    }

    @Override
    public String getCategoryName() {
        return "U6 Piger";
    }

    @Override
    public String getTitle() {
        return "Resultater - U6 Piger";
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
        return Gender.FEMALE;
    }
}
