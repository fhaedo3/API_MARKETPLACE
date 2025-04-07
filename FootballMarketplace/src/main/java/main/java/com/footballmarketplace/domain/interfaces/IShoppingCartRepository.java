package main.java.com.footballmarketplace.domain.interfaces;

import main.java.com.footballmarketplace.domain.model.ShoppingCart;

import java.util.List;
import java.util.Optional;

public interface IShoppingCartRepository {
    List<ShoppingCart> findAll();
    Optional<ShoppingCart> findById(Long id);
    ShoppingCart save(ShoppingCart shoppingCart);
    void deleteById(Long id);
}