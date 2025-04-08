package com.footballmarketplace.domain.model;

import com.footballmarketplace.domain.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users")
public class User extends Auditable {

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private String teamName;

    @Column
    private Integer yearFounded;

    @Column
    private String stadium;

    @Column
    private String city;

    @Enumerated(EnumType.STRING)
    @Column
    private Role role;

    @OneToMany(mappedBy = "owner")
    private List<Player> players;

    @OneToMany(mappedBy = "user")
    private List<ShoppingCart> shoppingCarts;

    @OneToMany(mappedBy = "buyer")
    private List<Transaction> purchases;

    @OneToMany(mappedBy = "seller")
    private List<Transaction> sales;
}