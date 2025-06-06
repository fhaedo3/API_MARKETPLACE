package com.footballmarketplace.application.dto.response;

import lombok.Data;

@Data
public class CartItemResponse {
    private Long id;
    private Long cartId;
    private Long playerId;
    // Puedes agregar más campos según lo que quieras exponer
}
