package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.Player;

import java.util.List;
import java.util.Optional;

public interface IPlayerRepository {
    List<Player> findAll();
    Optional<Player> findById(Long id);
    Player save(Player player);
    void deleteById(Long id);
}