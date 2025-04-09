package com.footballmarketplace.domain.model;

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
    private ShoppingCart cart;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;
}
