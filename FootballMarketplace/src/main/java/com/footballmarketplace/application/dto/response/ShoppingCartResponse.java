package com.footballmarketplace.application.dto.response;

import lombok.Data;

@Data
public class ShoppingCartResponse {
    private Long id;
    private Long userId;
    private String status;
    // Agrega más campos si es necesario
}
