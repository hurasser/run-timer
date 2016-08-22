package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U12WomenCategory implements ResultCategory {
    @Override
    public String getCategoryId() {
        return "U12Women";
    }

    @Override
    public String getCategoryName() {
        return "U12 Piger";
    }

    @Override
    public String getTitle() {
        return "Resultater - U12 Piger";
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
        return Gender.FEMALE;
    }
}
