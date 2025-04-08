package com.footballmarketplace.domain.model;

import lombok.Data;

@Data
public class Player extends Auditable {
    private String name;
    private String position;
    private Integer rating;

    private String characteristics; 

    private Double price;
    private Boolean isForSale;      
    private Long ownerId;           

    private String image;           
}