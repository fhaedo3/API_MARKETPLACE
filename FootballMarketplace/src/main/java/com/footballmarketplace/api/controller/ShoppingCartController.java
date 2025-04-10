package com.footballmarketplace.api.controller;

import com.footballmarketplace.application.dto.ShoppingCartRequest;
import com.footballmarketplace.application.service.ShoppingCartService;
import com.footballmarketplace.application.service.UserService;
import com.footballmarketplace.domain.model.ShoppingCart;
import com.footballmarketplace.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/shopping-carts")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<ShoppingCart>> listShoppingCarts() {
        List<ShoppingCart> carts = shoppingCartService.getAllShoppingCarts();
        return ResponseEntity.ok(carts);
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<ShoppingCart> getShoppingCartById(@PathVariable Long cartId) {
        return shoppingCartService.getShoppingCartById(cartId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    @GetMapping("/user/{userId}/active")
    public ResponseEntity<ShoppingCart> getActiveCartForUser(@PathVariable Long userId) {
        ShoppingCart cart = shoppingCartService.getActiveCartForUser(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<ShoppingCart> addShoppingCart(@RequestBody ShoppingCartRequest request) {
        ShoppingCart cart = new ShoppingCart();
        User user = userService.getUserById(request.getUserId()); 

        cart.setUser(user);
        cart.setStatus(request.getStatus());

        ShoppingCart savedCart = shoppingCartService.addShoppingCart(cart);
        return ResponseEntity.created(URI.create("/shopping-carts/" + savedCart.getId())).body(savedCart);
    }

    @PutMapping("/{cartId}/checkout")
    public ResponseEntity<ShoppingCart> checkout(@PathVariable Long cartId) {
        ShoppingCart checkedOutCart = shoppingCartService.checkout(cartId);
        if (checkedOutCart != null) {
            return ResponseEntity.ok(checkedOutCart);
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteShoppingCart(@PathVariable Long cartId) {
        shoppingCartService.deleteShoppingCart(cartId);
        return ResponseEntity.noContent().build();
    }
}