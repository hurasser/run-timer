package com.runit.runtimer.dto;

import java.util.List;

public class CategoryResultResponse {
    public String categoryTitle;
    public int categoryIndex;
    public List<ResultDto> results;

    public CategoryResultResponse() {
    }

    public CategoryResultResponse(String categoryTitle, int categoryIndex, List<ResultDto> results) {
        this.categoryTitle = categoryTitle;
        this.results = results;
        this.categoryIndex = categoryIndex;
    }
}
