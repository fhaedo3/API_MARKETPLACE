package main.java.com.footballmarketplace.domain.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ShoppingCart extends Auditable {
    private Long userId; 
    private String status; 

    private List<Long> cartItemIds = new ArrayList<>(); 
}