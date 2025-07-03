package com.footballmarketplace.application.service;

import com.footballmarketplace.application.dto.response.PlayerResponse;
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
        if (!playerRepository.existsById(id)) {
            throw new IllegalArgumentException("Jugador no encontrado con ID: " + id);
        }
        return playerRepository.findById(id);
    }

    public Player addPlayer(Player player) {
        if (player == null) {
            throw new IllegalArgumentException("El jugador no puede ser nulo.");
        }
        return playerRepository.save(player);
    }

    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new IllegalArgumentException("Jugador no encontrado con ID: " + id);
        }
        playerRepository.deleteById(id);
    }

    public List<Player> getPlayersByOwnerId(Long ownerId) {
        if (userService.getUserById(ownerId) == null) {
            throw new IllegalArgumentException("El usuario dueño no existe con ID: " + ownerId);
        }
        return playerRepository.findByOwnerId(ownerId);
    }

    public Player updatePlayerOwner(Long playerId, Long ownerId) {
        Player player = playerRepository.findById(playerId)
            .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado con ID: " + playerId));
        User owner = userService.getUserById(ownerId);
        player.setOwner(owner);
        return playerRepository.save(player);
    }

    public List<Player> getPlayersForSale() {
        return playerRepository.findByIsForSaleTrue();
    }

    // Mapper de Player a PlayerResponse
    public PlayerResponse toPlayerResponse(Player player) {
        PlayerResponse resp = new PlayerResponse();
        resp.setId(player.getId());
        resp.setName(player.getName());
        resp.setLastName(player.getLastName());
        resp.setPosition(player.getPosition());
        resp.setRating(player.getRating());
        resp.setCharacteristics(player.getCharacteristics());
        resp.setPrice(player.getPrice());
        resp.setIsForSale(player.getIsForSale());
        resp.setImage(player.getImage());
        if (player.getOwner() != null) {
            resp.setOwnerId(player.getOwner().getId());
            resp.setOwnerName(player.getOwner().getUsername());
            resp.setClubName(player.getOwner().getTeamName());
        }
        return resp;
    }

    public List<PlayerResponse> getAllPlayersResponse() {
        return getAllPlayers().stream().map(this::toPlayerResponse).toList();
    }

    public List<PlayerResponse> getPlayersByOwnerIdResponse(Long ownerId) {
        return getPlayersByOwnerId(ownerId).stream().map(this::toPlayerResponse).toList();
    }

    public PlayerResponse getPlayerResponseById(Long id) {
        return getPlayerById(id).map(this::toPlayerResponse).orElse(null);
    }
}