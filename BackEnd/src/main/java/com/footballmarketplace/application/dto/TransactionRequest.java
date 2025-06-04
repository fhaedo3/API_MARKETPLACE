package com.footballmarketplace.application.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private Long buyerId;
    private Long sellerId;
    private Long playerId;
    private Long operationId;
    private Double total;
}