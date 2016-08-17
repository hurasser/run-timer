package com.runit.runtimer.dto;

import com.runit.runtimer.model.Gender;
import com.runit.runtimer.model.Runner;

public class RunnerDto {

    public int id;
    public int number;
    public String firstName;
    public String lastName;
    public int age;
    public Gender gender;

    public RunnerDto() {
    }

    public RunnerDto(Runner runner) {
        this.id = runner.getId();
        this.number = runner.getRunnerNumber();
        this.firstName = runner.getFirstName();
        this.lastName = runner.getLastName();
        this.age = runner.getAge();
        this.gender = runner.getGender();
    }
}
