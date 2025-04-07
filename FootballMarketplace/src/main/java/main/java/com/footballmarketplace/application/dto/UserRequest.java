package main.java.com.footballmarketplace.application.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String username; // Nombre de usuario
    private String email;    // Correo electrónico
    private String password; // Contraseña
}