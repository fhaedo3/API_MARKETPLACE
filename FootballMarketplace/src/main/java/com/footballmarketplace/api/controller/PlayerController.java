package com.footballmarketplace.api.controller;

import com.footballmarketplace.application.dto.PlayerRequest;
import com.footballmarketplace.application.service.PlayerService;
import com.footballmarketplace.application.service.UserService;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Player>> listPlayers() {
        List<Player> players = playerService.getAllPlayers();
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{playerId}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long playerId) {
        return playerService.getPlayerById(playerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Player>> getPlayersByOwnerId(@PathVariable Long ownerId) {
        List<Player> players = playerService.getPlayersByOwnerId(ownerId);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/forsale")
    public ResponseEntity<List<Player>> getPlayersForSale() {
        List<Player> players = playerService.getPlayersForSale();
        return ResponseEntity.ok(players);
    }

    @PostMapping
    public ResponseEntity<Player> addPlayer(@RequestBody PlayerRequest playerRequest) {
        Player player = new Player();
        player.setName(playerRequest.getName());
        player.setPosition(playerRequest.getPosition());
        player.setRating(playerRequest.getRating());
        player.setCharacteristics(playerRequest.getCharacteristics());
        player.setPrice(playerRequest.getPrice());
        player.setIsForSale(playerRequest.getIsForSale());
        player.setImage(playerRequest.getImage());
    
        if (playerRequest.getOwnerId() != null) {
            User owner = userService.getUserById(playerRequest.getOwnerId());
            player.setOwner(owner);
        }
    
        Player savedPlayer = playerService.addPlayer(player);
        return ResponseEntity.created(URI.create("/players/" + savedPlayer.getId())).body(savedPlayer);
    }

    @PutMapping("/{playerId}/owner/{ownerId}")
    public ResponseEntity<Player> updatePlayerOwner(@PathVariable Long playerId, @PathVariable Long ownerId) {
        Player updatedPlayer = playerService.updatePlayerOwner(playerId, ownerId);
        if (updatedPlayer != null) {
            return ResponseEntity.ok(updatedPlayer);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{playerId}/forsale/{isForSale}")
    public ResponseEntity<Player> updatePlayerForSaleStatus(@PathVariable Long playerId,
            @PathVariable Boolean isForSale) {
        Optional<Player> playerOpt = playerService.getPlayerById(playerId);
        if (playerOpt.isPresent()) {
            Player player = playerOpt.get();
            player.setIsForSale(isForSale);
            Player updatedPlayer = playerService.addPlayer(player);
            return ResponseEntity.ok(updatedPlayer);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long playerId) {
        playerService.deletePlayer(playerId);
        return ResponseEntity.noContent().build();
    }
}