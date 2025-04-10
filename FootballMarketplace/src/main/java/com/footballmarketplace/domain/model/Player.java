package com.footballmarketplace.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonBackReference // Evita la serialización cíclica con el propietario
    private User owner;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference // Evita la serialización cíclica con los ítems del carrito
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference // Evita la serialización cíclica con las transacciones
    private List<Transaction> transactions;
}