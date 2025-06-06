package com.footballmarketplace.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "cart_items")
public class CartItem extends Auditable {

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonBackReference 
    private ShoppingCart cart;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    @JsonBackReference 
    private Player player;
}