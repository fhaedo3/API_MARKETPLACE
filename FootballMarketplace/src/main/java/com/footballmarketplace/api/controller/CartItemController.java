package com.footballmarketplace.api.controller;

import com.footballmarketplace.application.dto.CartItemRequest;
import com.footballmarketplace.application.service.CartItemService;
import com.footballmarketplace.domain.model.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/cart-items")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

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

    @PostMapping
    public ResponseEntity<CartItem> addCartItem(@RequestBody CartItemRequest cartItemRequest) {
        CartItem cartItem = new CartItem();
        cartItem.setCartId(cartItemRequest.getCartId());
        cartItem.setPlayerId(cartItemRequest.getPlayerId());

        CartItem savedItem = cartItemService.addCartItem(cartItem);
        return ResponseEntity.created(URI.create("/cart-items/" + savedItem.getId())).body(savedItem);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long cartItemId) {
        cartItemService.deleteCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }
}