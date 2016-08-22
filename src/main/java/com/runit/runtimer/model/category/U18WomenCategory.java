package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U18WomenCategory implements ResultCategory {
    @Override
    public String getCategoryId() {
        return "U18 Piger";
    }

    @Override
    public String getCategoryName() {
        return "U18 Piger";
    }

    @Override
    public String getTitle() {
        return "Resultater - U18 Piger";
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
        return Gender.FEMALE;
    }
}
