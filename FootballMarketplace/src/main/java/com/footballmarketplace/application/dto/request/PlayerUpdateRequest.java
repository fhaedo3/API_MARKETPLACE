package com.footballmarketplace.application.dto.request;

import lombok.Data;

@Data
public class PlayerUpdateRequest {
    private String name;
    private String lastName;
    private String position;
    private Integer rating;
    private Integer pace;
    private Integer shooting;
    private Integer passing;
    private Integer dribbling;
    private Integer defending;
    private Integer physical;
    private String characteristics;
    private Double price;
}
