package main.java.com.footballmarketplace.domain.model;

import lombok.Data;

@Data
public class Player {
    private Long id;
    private String name;       
    private String position;   
}