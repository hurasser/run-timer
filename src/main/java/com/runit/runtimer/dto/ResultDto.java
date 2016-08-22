package com.runit.runtimer.dto;

public class ResultDto {
    public int id;
    public int number;
    public int time;
    public String name;

    public ResultDto() {
    }

    public ResultDto(int number, int time, String name, int id) {
        this.number = number;
        this.time = time;
        this.name = name;
        this.id = id;
    }
}
