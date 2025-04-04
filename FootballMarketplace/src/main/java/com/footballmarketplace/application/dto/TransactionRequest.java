package main.java.com.footballmarketplace.application.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private Long userId;   // ID del usuario que realiza la transacción
    private Double amount; // Monto de la transacción
}