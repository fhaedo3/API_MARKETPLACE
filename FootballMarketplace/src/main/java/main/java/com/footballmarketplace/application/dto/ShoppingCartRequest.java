package main.java.com.footballmarketplace.application.dto;

import lombok.Data;

@Data
public class ShoppingCartRequest {
    private Long userId;
    private String status;
}