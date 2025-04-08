package com.footballmarketplace.domain.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Transaction extends Auditable {
    private Long buyerId;     
    private Long sellerId;    
    private Long playerId;    
    private Long operationId; 

    private LocalDateTime date; 
    private Double total;      
}