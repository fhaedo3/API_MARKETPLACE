package com.footballmarketplace.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 30, message = "El nombre de usuario debe tener entre 3 y 30 caracteres")
    private String username;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, max = 50, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @NotBlank(message = "El nombre del equipo es obligatorio")
    private String teamName;

    @NotNull(message = "El año de fundación es obligatorio")
    private Integer yearFounded;

    @NotBlank(message = "El estadio es obligatorio")
    private String stadium;

    @NotBlank(message = "La ciudad es obligatoria")
    private String city;

    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "^(USER|ADMIN)$", message = "El rol debe ser USER o ADMIN")
    private String role; 
}
