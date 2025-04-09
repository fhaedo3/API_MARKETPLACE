package com.footballmarketplace.application.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long cartId;
    private Long playerId;
}