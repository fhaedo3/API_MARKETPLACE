package com.footballmarketplace.api.controller;

import com.footballmarketplace.application.dto.request.UserRequest;
import com.footballmarketplace.application.dto.response.UserResponse;
import com.footballmarketplace.application.service.UserService;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.ShoppingCart;
import com.footballmarketplace.domain.model.Transaction;
import com.footballmarketplace.domain.model.User;
import com.footballmarketplace.domain.enums.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> listUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponse> response = users.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(toResponse(user));
    }

    @GetMapping("/{userId}/players")
    public ResponseEntity<List<Player>> getUserPlayers(@PathVariable Long userId) {
        List<Player> players = userService.getUserPlayers(userId);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{userId}/carts")
    public ResponseEntity<List<ShoppingCart>> getUserCarts(@PathVariable Long userId) {
        List<ShoppingCart> carts = userService.getUserCarts(userId);
        return ResponseEntity.ok(carts);
    }

    @GetMapping("/{userId}/purchases")
    public ResponseEntity<List<Transaction>> getUserPurchases(@PathVariable Long userId) {
        List<Transaction> purchases = userService.getUserPurchases(userId);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/{userId}/sales")
    public ResponseEntity<List<Transaction>> getUserSales(@PathVariable Long userId) {
        List<Transaction> sales = userService.getUserSales(userId);
        return ResponseEntity.ok(sales);
    }

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());
        user.setTeamName(userRequest.getTeamName());
        user.setYearFounded(userRequest.getYearFounded());
        user.setStadium(userRequest.getStadium());
        user.setCity(userRequest.getCity());
        user.setRole(Role.valueOf(userRequest.getRole().toUpperCase()));

        User savedUser = userService.addUser(user);
        return ResponseEntity.created(URI.create("/users/" + savedUser.getId())).body(savedUser);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setTeamName(user.getTeamName());
        response.setYearFounded(user.getYearFounded());
        response.setStadium(user.getStadium());
        response.setCity(user.getCity());
        response.setRole(user.getRole() != null ? user.getRole().name() : null);
        return response;
    }
}