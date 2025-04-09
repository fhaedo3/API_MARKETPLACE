package com.footballmarketplace.application.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String email;
    private String password;
    private String teamName;
    private Integer yearFounded;
    private String stadium;
    private String city;
    private String role;
}