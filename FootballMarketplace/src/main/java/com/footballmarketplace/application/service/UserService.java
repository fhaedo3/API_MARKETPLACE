package com.footballmarketplace.application.service;

import com.footballmarketplace.domain.interfaces.IUserRepository;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.ShoppingCart;
import com.footballmarketplace.domain.model.Transaction;
import com.footballmarketplace.domain.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final IUserRepository userRepository;

    public UserService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User addUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<Player> getUserPlayers(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getPlayers();
        }
        return List.of();
    }

    public List<ShoppingCart> getUserCarts(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getShoppingCarts();
        }
        return List.of();
    }

    public List<Transaction> getUserPurchases(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getPurchases();
        }
        return List.of();
    }

    public List<Transaction> getUserSales(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getSales();
        }
        return List.of();
    }
}