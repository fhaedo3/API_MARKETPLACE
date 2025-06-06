package com.footballmarketplace.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShoppingCartRequest {
    @NotNull(message = "El ID de usuario es obligatorio")
    private Long userId;
    @NotBlank(message = "El estado es obligatorio")
    private String status;
}
