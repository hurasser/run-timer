package com.runit.runtimer.model.category;

import com.runit.runtimer.model.Gender;

public interface ResultCategory {

    String getCategoryId();
    String getCategoryName();
    String getTitle();
    int getMinAge();
    int getMaxAge();
    Gender getGender();
}
