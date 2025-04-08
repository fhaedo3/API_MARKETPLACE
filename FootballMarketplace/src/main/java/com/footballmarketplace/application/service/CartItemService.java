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
        return cartItemRepository.save(cartItem);
    }

    public void deleteCartItem(Long id) {
        cartItemRepository.deleteById(id);
    }

    public List<CartItem> getCartItemsByCartId(Long cartId) {
        return cartItemRepository.findByCartId(cartId);
    }

    public CartItem addPlayerToCart(Long cartId, Long playerId) {
        ShoppingCart cart = shoppingCartService.getShoppingCartById(cartId).orElse(null);
        Player player = playerService.getPlayerById(playerId).orElse(null);

        if (cart != null && player != null && player.getIsForSale()) {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setPlayer(player);
            return cartItemRepository.save(cartItem);
        }
        return null;
    }

    public void removePlayerFromCart(Long cartId, Long playerId) {
        CartItem cartItem = cartItemRepository.findByCartIdAndPlayerId(cartId, playerId);
        if (cartItem != null) {
            deleteCartItem(cartItem.getId());
        }
    }
}