package com.footballmarketplace.domain.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Operation extends Auditable {
    private Long id;
    private String description; 
    private LocalDateTime timestamp;
}