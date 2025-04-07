package main.java.com.footballmarketplace.domain.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Transaction {
    private Long id;
    private Long userId;         // ID del usuario que realizó la transacción
    private Double amount;       // Monto de la transacción
    private LocalDateTime date;  // Fecha y hora de la transacción
}