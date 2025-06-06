package com.footballmarketplace.application.service;

import com.footballmarketplace.domain.interfaces.IShoppingCartRepository;
import com.footballmarketplace.domain.model.ShoppingCart;
import com.footballmarketplace.domain.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartService {

    private final IShoppingCartRepository shoppingCartRepository;
    private final UserService userService;
    private static final int CART_EXPIRATION_HOURS = 24;

    public ShoppingCartService(IShoppingCartRepository shoppingCartRepository, UserService userService) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.userService = userService;
    }

    public List<ShoppingCart> getAllShoppingCarts() {
        return shoppingCartRepository.findAll();
    }

    public Optional<ShoppingCart> getShoppingCartById(Long id) {
        if (!shoppingCartRepository.existsById(id)) {
            throw new IllegalArgumentException("El carrito no existe con ID: " + id);
        }
        return shoppingCartRepository.findById(id);
    }

    public ShoppingCart addShoppingCart(ShoppingCart shoppingCart) {
        if (shoppingCart == null) {
            throw new IllegalArgumentException("El carrito no puede ser nulo.");
        }
        return shoppingCartRepository.save(shoppingCart);
    }

    public void deleteShoppingCart(Long id) {
        if (!shoppingCartRepository.existsById(id)) {
            throw new IllegalArgumentException("El carrito no existe con ID: " + id);
        }
        shoppingCartRepository.deleteById(id);
    }

    public List<ShoppingCart> getShoppingCartsByUserId(Long userId) {
        if (userService.getUserById(userId) == null) {
            throw new IllegalArgumentException("El usuario no existe con ID: " + userId);
        }
        return shoppingCartRepository.findByUserId(userId);
    }

    public ShoppingCart getActiveCartForUser(Long userId) {
        // Limpia carritos expirados antes de devolver o crear uno nuevo
        cleanExpiredCarts(userId);
        return shoppingCartRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .filter(cart -> cart.getExpiration() == null || cart.getExpiration().isAfter(LocalDateTime.now()))
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart();
                    User user = userService.getUserById(userId);
                    newCart.setUser(user);
                    newCart.setStatus("ACTIVE");
                    newCart.setExpiration(LocalDateTime.now().plusHours(CART_EXPIRATION_HOURS));
                    return shoppingCartRepository.save(newCart);
                });
    }

    public void cleanExpiredCarts(Long userId) {
        List<ShoppingCart> carts = shoppingCartRepository.findByUserId(userId);
        for (ShoppingCart cart : carts) {
            if (cart.getExpiration() != null && cart.getExpiration().isBefore(LocalDateTime.now())) {
                shoppingCartRepository.delete(cart);
            }
        }
    }

    public ShoppingCart createCartOnLogin(Long userId) {
        // Lógica para crear carrito automáticamente al iniciar sesión
        return getActiveCartForUser(userId);
    }

    public ShoppingCart checkout(Long cartId) {
        ShoppingCart cart = shoppingCartRepository.findById(cartId)
            .orElseThrow(() -> new IllegalArgumentException("El carrito no existe con ID: " + cartId));
        if (!"ACTIVE".equals(cart.getStatus())) {
            throw new IllegalStateException("El carrito no está activo y no puede ser completado.");
        }
        cart.setStatus("COMPLETED");
        return shoppingCartRepository.save(cart);
    }
}