package com.footballmarketplace.application.service;

import com.footballmarketplace.domain.interfaces.IPlayerRepository;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    private final IPlayerRepository playerRepository;
    private final UserService userService;

    public PlayerService(IPlayerRepository playerRepository, UserService userService) {
        this.playerRepository = playerRepository;
        this.userService = userService;
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public Player addPlayer(Player player) {
        return playerRepository.save(player);
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    public List<Player> getPlayersByOwnerId(Long ownerId) {
        return playerRepository.findByOwnerId(ownerId);
    }

    public Player updatePlayerOwner(Long playerId, Long ownerId) {
        Optional<Player> playerOpt = playerRepository.findById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            User owner = userService.getUserById(ownerId);
            player.setOwner(owner);
            return playerRepository.save(player);
        }
        return null;
    }

    public List<Player> getPlayersForSale() {
        return playerRepository.findByIsForSaleTrue();
    }
}