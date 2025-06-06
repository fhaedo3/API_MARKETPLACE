package com.footballmarketplace.application.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransactionRequest {
    @NotNull(message = "El ID del comprador es obligatorio")
    private Long buyerId;
    @NotNull(message = "El ID del vendedor es obligatorio")
    private Long sellerId;
    @NotNull(message = "El ID del jugador es obligatorio")
    private Long playerId;
    @NotNull(message = "El ID de la operación es obligatorio")
    private Long operationId;
    @NotNull(message = "El total es obligatorio")
    @Positive(message = "El total debe ser mayor a 0")
    private Double total;
}
