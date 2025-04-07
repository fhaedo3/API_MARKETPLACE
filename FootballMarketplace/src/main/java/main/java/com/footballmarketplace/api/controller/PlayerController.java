package main.java.com.footballmarketplace.api.controller;

import main.java.com.footballmarketplace.application.dto.PlayerRequest;
import main.java.com.footballmarketplace.application.service.PlayerService;
import main.java.com.footballmarketplace.domain.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

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

    @PostMapping
    public ResponseEntity<Player> addPlayer(@RequestBody PlayerRequest playerRequest) {
        Player player = new Player();
        player.setName(playerRequest.getName());
        player.setPosition(playerRequest.getPosition());
        player.setRating(playerRequest.getRating());
        player.setCharacteristics(playerRequest.getCharacteristics());
        player.setPrice(playerRequest.getPrice());
        player.setIsForSale(playerRequest.getIsForSale());
        player.setOwnerId(playerRequest.getOwnerId());
        player.setImage(playerRequest.getImage());

        Player savedPlayer = playerService.addPlayer(player);
        return ResponseEntity.created(URI.create("/players/" + savedPlayer.getId())).body(savedPlayer);
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long playerId) {
        playerService.deletePlayer(playerId);
        return ResponseEntity.noContent().build();
    }
}