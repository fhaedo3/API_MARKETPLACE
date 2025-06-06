package com.footballmarketplace.application.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String teamName;
    private Integer yearFounded;
    private String stadium;
    private String city;
    private String role;
    // Agrega más campos si es necesario
}
