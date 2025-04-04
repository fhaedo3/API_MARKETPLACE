package main.java.com.footballmarketplace.domain.interfaces;

import main.java.com.footballmarketplace.domain.model.CartItem;

import java.util.List;
import java.util.Optional;

public interface ICartItemRepository {
    List<CartItem> findAll();
    Optional<CartItem> findById(Long id);
    CartItem save(CartItem cartItem);
    void deleteById(Long id);
}