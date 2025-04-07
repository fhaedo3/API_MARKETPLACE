package main.java.com.footballmarketplace.domain.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Operation {
    private Long id;
    private String description;
    private LocalDateTime timestamp;
}