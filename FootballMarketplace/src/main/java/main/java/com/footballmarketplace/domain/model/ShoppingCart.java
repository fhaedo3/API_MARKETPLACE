package main.java.com.footballmarketplace.domain.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ShoppingCart {
    private Long id;
    private Long userId; // ID del usuario propietario del carrito
    private List<Long> cartItemIds = new ArrayList<>(); // IDs de los CartItems asociados
}