package com.footballmarketplace.domain.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "players")
public class Player extends Auditable {

    @Column(nullable = false)
    private String name;

    @Column
    private String position;

    @Column
    private Integer rating;

    @Column(length = 1000)
    private String characteristics;

    @Column
    private Double price;

    @Column
    private Boolean isForSale;

    @Column
    private String image;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "player")
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "player")
    private List<Transaction> transactions;
}