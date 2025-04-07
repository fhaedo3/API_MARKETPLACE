package main.java.com.footballmarketplace.application.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long cartId;   // ID del carrito
    private Long playerId; // ID del jugador
}