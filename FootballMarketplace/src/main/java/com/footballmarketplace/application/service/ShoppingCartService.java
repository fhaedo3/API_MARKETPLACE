package com.footballmarketplace.application.service;

import com.footballmarketplace.domain.interfaces.IShoppingCartRepository;
import com.footballmarketplace.domain.model.ShoppingCart;
import com.footballmarketplace.domain.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartService {

    private final IShoppingCartRepository shoppingCartRepository;
    private final UserService userService;

    public ShoppingCartService(IShoppingCartRepository shoppingCartRepository, UserService userService) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.userService = userService;
    }

    public List<ShoppingCart> getAllShoppingCarts() {
        return shoppingCartRepository.findAll();
    }

    public Optional<ShoppingCart> getShoppingCartById(Long id) {
        return shoppingCartRepository.findById(id);
    }

    public ShoppingCart addShoppingCart(ShoppingCart shoppingCart) {
        return shoppingCartRepository.save(shoppingCart);
    }

    public void deleteShoppingCart(Long id) {
        shoppingCartRepository.deleteById(id);
    }

    public List<ShoppingCart> getShoppingCartsByUserId(Long userId) {
        return shoppingCartRepository.findByUserId(userId);
    }

    public ShoppingCart getActiveCartForUser(Long userId) {
        return shoppingCartRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart();
                    User user = userService.getUserById(userId).orElse(null);
                    newCart.setUser(user);
                    newCart.setStatus("ACTIVE");
                    return shoppingCartRepository.save(newCart);
                });
    }

    public ShoppingCart checkout(Long cartId) {
        Optional<ShoppingCart> cartOpt = shoppingCartRepository.findById(cartId);
        if (cartOpt.isPresent() && "ACTIVE".equals(cartOpt.get().getStatus())) {
            ShoppingCart cart = cartOpt.get();
            cart.setStatus("COMPLETED");
            return shoppingCartRepository.save(cart);
        }
        return null;
    }
}