package com.footballmarketplace.application.dto.response;

import lombok.Data;

@Data
public class PlayerResponse {
    private Long id;
    private String name;
    private String position;
    private Integer rating;
    private String characteristics;
    private Double price;
    private Boolean isForSale;
    private Long ownerId;
    private String image;
}
