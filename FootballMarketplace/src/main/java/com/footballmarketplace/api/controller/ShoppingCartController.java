package main.java.com.footballmarketplace.api.controller;

import main.java.com.footballmarketplace.application.dto.ShoppingCartRequest;
import main.java.com.footballmarketplace.application.service.ShoppingCartService;
import main.java.com.footballmarketplace.domain.model.ShoppingCart;
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

    @PostMapping
    public ResponseEntity<ShoppingCart> addShoppingCart(@RequestBody ShoppingCartRequest request) {
        ShoppingCart cart = new ShoppingCart();
        cart.setUserId(request.getUserId());

        ShoppingCart savedCart = shoppingCartService.addShoppingCart(cart);
        return ResponseEntity.created(URI.create("/shopping-carts/" + savedCart.getId())).body(savedCart);
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteShoppingCart(@PathVariable Long cartId) {
        shoppingCartService.deleteShoppingCart(cartId);
        return ResponseEntity.noContent().build();
    }
}