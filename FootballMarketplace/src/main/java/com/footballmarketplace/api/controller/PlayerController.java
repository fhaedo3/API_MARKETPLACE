package com.footballmarketplace.api.controller;

import com.footballmarketplace.application.dto.request.PlayerRequest;
import com.footballmarketplace.application.service.PlayerService;
import com.footballmarketplace.application.service.UserService;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @Autowired
    private UserService userService;

    private final String IMAGE_BASE_PATH = "FrontEnd/public/images/players";

    @GetMapping
    public ResponseEntity<List<Player>> listPlayers() {
        List<Player> players = playerService.getAllPlayers();
        return ResponseEntity.ok(players);
    }

    @GetMapping("/public")
    public ResponseEntity<List<Player>> listPublicPlayers() {
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

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Player> addPlayerWithImage(
            @RequestPart("player") PlayerRequest playerRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        Player player = new Player();
        player.setName(playerRequest.getName());
        player.setPosition(playerRequest.getPosition());
        player.setRating(playerRequest.getRating());
        player.setCharacteristics(playerRequest.getCharacteristics());
        player.setPrice(playerRequest.getPrice());
        player.setIsForSale(playerRequest.getIsForSale());
        if (playerRequest.getOwnerId() != null) {
            User owner = userService.getUserById(playerRequest.getOwnerId());
            player.setOwner(owner);
        }
        Player savedPlayer = playerService.addPlayer(player);
        // Handle image upload
        if (imageFile != null && !imageFile.isEmpty() && imageFile.getOriginalFilename() != null) {
            try {
                Path playerDir = Paths.get(IMAGE_BASE_PATH, String.valueOf(savedPlayer.getId()));
                Files.createDirectories(playerDir);
                String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
                Path targetPath = playerDir.resolve(fileName);
                Files.copy(imageFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                // Save relative path in DB
                savedPlayer.setImage("/images/players/" + savedPlayer.getId() + "/" + fileName);
                playerService.addPlayer(savedPlayer);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            savedPlayer.setImage("/images/nn.png");
            playerService.addPlayer(savedPlayer);
        }
        return ResponseEntity.created(URI.create("/players/" + savedPlayer.getId())).body(savedPlayer);
    }

    @GetMapping("/image/{playerId}/{fileName}")
    public ResponseEntity<Resource> getPlayerImage(@PathVariable Long playerId, @PathVariable String fileName) {
        try {
            Path imagePath = Paths.get(IMAGE_BASE_PATH, String.valueOf(playerId), fileName);
            Resource resource = new UrlResource(imagePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
            } else {
                Path defaultPath = Paths.get("FrontEnd/public/images/nn.png");
                Resource defaultResource = new UrlResource(defaultPath.toUri());
                return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(defaultResource);
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
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
