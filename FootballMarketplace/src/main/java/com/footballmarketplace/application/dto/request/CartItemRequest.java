package com.footballmarketplace.application.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull(message = "El ID del carrito es obligatorio")
    private Long cartId;
    @NotNull(message = "El ID del jugador es obligatorio")
    private Long playerId;
}
