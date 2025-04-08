package com.footballmarketplace.domain.model;

import lombok.Data;

@Data
public class CartItem extends Auditable{
    private Long id;
    private Long cartId;  
    private Long playerId; 
}