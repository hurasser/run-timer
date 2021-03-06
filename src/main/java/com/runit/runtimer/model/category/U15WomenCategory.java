package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public class U15WomenCategory implements ResultCategory {
    @Override
    public String getCategoryId() {
        return "U15Women";
    }

    @Override
    public String getCategoryName() {
        return "U15 Piger";
    }

    @Override
    public String getTitle() {
        return "Resultater - U15 Piger";
    }

    @Override
    public int getMinAge() {
        return 0;
    }

    @Override
    public int getMaxAge() {
        return 15;
    }

    @Override
    public Gender getGender() {
        return Gender.FEMALE;
    }
}
