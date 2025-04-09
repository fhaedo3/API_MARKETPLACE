package com.footballmarketplace.domain.model;

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
    private User user;

    @Column(nullable = false)
    private String status;

    @OneToMany(mappedBy = "cart")
    private List<CartItem> cartItems = new ArrayList<>();
}
