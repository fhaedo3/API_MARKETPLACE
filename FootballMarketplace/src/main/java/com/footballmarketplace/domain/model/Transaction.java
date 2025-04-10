package com.footballmarketplace.domain.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "transactions")
public class Transaction extends Auditable {

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    @JsonManagedReference // Permite serializar el comprador
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    @JsonManagedReference // Permite serializar el vendedor
    private User seller;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    @JsonManagedReference // Permite serializar el jugador
    private Player player;

    @ManyToOne
    @JoinColumn(name = "operation_id", nullable = false)
    @JsonManagedReference // Permite serializar la operación
    private Operation operation;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private Double total;
}