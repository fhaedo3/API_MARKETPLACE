package main.java.com.footballmarketplace.application.dto;

import lombok.Data;

@Data
public class PlayerRequest {
    private String name;       // Nombre del jugador
    private String position;   // Posición del jugador
}