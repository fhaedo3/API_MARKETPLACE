package com.footballmarketplace.application.service;

import com.footballmarketplace.domain.interfaces.IUserRepository;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.ShoppingCart;
import com.footballmarketplace.domain.model.Transaction;
import com.footballmarketplace.domain.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final IUserRepository userRepository;

    public UserService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
    }

    public User addUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<Player> getUserPlayers(Long userId) {
        User user = getUserById(userId);
        return user.getPlayers();
    }

    public List<ShoppingCart> getUserCarts(Long userId) {
        User user = getUserById(userId);
        return user.getShoppingCarts();
    }

    public List<Transaction> getUserPurchases(Long userId) {
        User user = getUserById(userId);
        return user.getPurchases();
    }

    public List<Transaction> getUserSales(Long userId) {
        User user = getUserById(userId);
        return user.getSales();
    }
}