package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.ShoppingCart;

import java.util.List;
import java.util.Optional;

public interface IShoppingCartRepository {
    List<ShoppingCart> findAll();
    Optional<ShoppingCart> findById(Long id);
    ShoppingCart save(ShoppingCart shoppingCart);
    void deleteById(Long id);
}