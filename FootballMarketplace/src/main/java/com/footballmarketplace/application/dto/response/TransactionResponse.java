package com.footballmarketplace.application.dto.response;

import lombok.Data;

@Data
public class TransactionResponse {
    private Long id;
    private Long buyerId;
    private Long sellerId;
    private Long playerId;
    private Long operationId;
    private Double total;
    private String timestamp;
    // Agrega más campos si es necesario
}
