package com.footballmarketplace.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "shopping_carts")
public class ShoppingCart extends Auditable {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference 
    private User user;

    @Column(nullable = false)
    private String status;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference 
    private List<CartItem> cartItems = new ArrayList<>();

    @Column
    private java.time.LocalDateTime expiration;
}