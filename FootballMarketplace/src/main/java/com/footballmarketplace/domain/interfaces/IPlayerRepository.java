package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByOwnerId(Long ownerId);

    List<Player> findByIsForSaleTrue();
}