package com.footballmarketplace.api.controller;

import com.footballmarketplace.application.dto.CartItemRequest;
import com.footballmarketplace.application.service.CartItemService;
import com.footballmarketplace.application.service.PlayerService;
import com.footballmarketplace.application.service.ShoppingCartService;
import com.footballmarketplace.domain.model.CartItem;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.ShoppingCart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart-items")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<CartItem>> listCartItems() {
        List<CartItem> items = cartItemService.getAllCartItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{cartItemId}")
    public ResponseEntity<CartItem> getCartItemById(@PathVariable Long cartItemId) {
        return cartItemService.getCartItemById(cartItemId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cart/{cartId}")
    public ResponseEntity<List<CartItem>> getCartItemsByCartId(@PathVariable Long cartId) {
        List<CartItem> items = cartItemService.getCartItemsByCartId(cartId);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<CartItem> addCartItem(@RequestBody CartItemRequest cartItemRequest) {
        Optional<ShoppingCart> cartOpt = shoppingCartService.getShoppingCartById(cartItemRequest.getCartId());
        Optional<Player> playerOpt = playerService.getPlayerById(cartItemRequest.getPlayerId());

        if (cartOpt.isEmpty() || playerOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CartItem cartItem = new CartItem();
        cartItem.setCart(cartOpt.get());
        cartItem.setPlayer(playerOpt.get());

        CartItem savedItem = cartItemService.addCartItem(cartItem);
        return ResponseEntity.created(URI.create("/cart-items/" + savedItem.getId())).body(savedItem);
    }

    @PostMapping("/add-to-cart")
    public ResponseEntity<CartItem> addPlayerToCart(@RequestParam Long cartId, @RequestParam Long playerId) {
        CartItem cartItem = cartItemService.addPlayerToCart(cartId, playerId);
        if (cartItem != null) {
            return ResponseEntity.created(URI.create("/cart-items/" + cartItem.getId())).body(cartItem);
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/remove-from-cart")
    public ResponseEntity<Void> removePlayerFromCart(@RequestParam Long cartId, @RequestParam Long playerId) {
        cartItemService.removePlayerFromCart(cartId, playerId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long cartItemId) {
        cartItemService.deleteCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }
}