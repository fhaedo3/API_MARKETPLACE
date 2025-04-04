package main.java.com.footballmarketplace.domain.model;

import lombok.Data;

@Data
public class CartItem {
    private Long id;
    private Long cartId;  // ID del carrito al que pertenece
    private Long playerId; // ID del jugador asociado
}