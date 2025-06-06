package com.footballmarketplace.application.service;

import com.footballmarketplace.domain.interfaces.ICartItemRepository;
import com.footballmarketplace.domain.model.CartItem;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.ShoppingCart;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    private final ICartItemRepository cartItemRepository;
    private final ShoppingCartService shoppingCartService;
    private final PlayerService playerService;

    public CartItemService(
            ICartItemRepository cartItemRepository,
            ShoppingCartService shoppingCartService,
            PlayerService playerService) {
        this.cartItemRepository = cartItemRepository;
        this.shoppingCartService = shoppingCartService;
        this.playerService = playerService;
    }

    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    public Optional<CartItem> getCartItemById(Long id) {
        return cartItemRepository.findById(id);
    }

    public CartItem addCartItem(CartItem cartItem) {
        if (cartItem.getCart() == null) {
            throw new IllegalArgumentException("El carrito no existe.");
        }
        if (cartItem.getPlayer() == null) {
            throw new IllegalArgumentException("El jugador no existe.");
        }
        return cartItemRepository.save(cartItem);
    }

    public void deleteCartItem(Long id) {
        if (!cartItemRepository.existsById(id)) {
            throw new IllegalArgumentException("El item del carrito no existe.");
        }
        cartItemRepository.deleteById(id);
    }

    public List<CartItem> getCartItemsByCartId(Long cartId) {
        if (shoppingCartService.getShoppingCartById(cartId).isEmpty()) {
            throw new IllegalArgumentException("El carrito no existe.");
        }
        return cartItemRepository.findByCartId(cartId);
    }

    public CartItem addPlayerToCart(Long cartId, Long playerId) {
        ShoppingCart cart = shoppingCartService.getShoppingCartById(cartId)
            .orElseThrow(() -> new IllegalArgumentException("El carrito no existe."));
        Player player = playerService.getPlayerById(playerId)
            .orElseThrow(() -> new IllegalArgumentException("El jugador no existe."));

        if (!player.getIsForSale()) {
            throw new IllegalStateException("El jugador no está en venta.");
        }
        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setPlayer(player);
        return cartItemRepository.save(cartItem);
    }

    public void removePlayerFromCart(Long cartId, Long playerId) {
        CartItem cartItem = cartItemRepository.findByCartIdAndPlayerId(cartId, playerId);
        if (cartItem == null) {
            throw new IllegalArgumentException("El item del carrito no existe para ese carrito y jugador.");
        }
        deleteCartItem(cartItem.getId());
    }
}