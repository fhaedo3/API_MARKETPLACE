package com.footballmarketplace.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PlayerRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String name;
    
    @Size(max = 50, message = "El apellido debe tener máximo 50 caracteres")
    private String lastName;
    
    @NotBlank(message = "La posición es obligatoria")
    private String position;
    
    @NotNull(message = "El rating es obligatorio")
    @Positive(message = "El rating debe ser mayor a 0")
    private Integer rating;
    
    private Integer pace;
    private Integer shooting;
    private Integer passing;
    private Integer dribbling;
    private Integer defending;
    private Integer physical;
    
    @NotBlank(message = "Las características son obligatorias")
    private String characteristics;
    
    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private Double price;
    
    @NotNull(message = "El campo isForSale es obligatorio")
    private Boolean isForSale;
    
    @NotNull(message = "El ID del dueño es obligatorio")
    private Long ownerId;
    
    @NotBlank(message = "La imagen es obligatoria")
    private String image;
}
