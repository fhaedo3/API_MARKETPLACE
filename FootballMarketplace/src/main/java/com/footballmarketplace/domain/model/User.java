package main.java.com.footballmarketplace.domain.model;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String username; // Nombre de usuario
    private String email;    // Correo electrónico
    private String password; // Contraseña
}