package com.footballmarketplace.infrastructure.repository;

import com.footballmarketplace.domain.interfaces.ICartItemRepository;
import com.footballmarketplace.domain.model.CartItem;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class CartItemRepository implements ICartItemRepository {

    private final List<CartItem> cartItems = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public List<CartItem> findAll() {
        return new ArrayList<>(cartItems);
    }

    @Override
    public Optional<CartItem> findById(Long id) {
        return cartItems.stream().filter(item -> item.getId().equals(id)).findFirst();
    }

    @Override
    public CartItem save(CartItem cartItem) {
        if (cartItem.getId() == null) {
            cartItem.setId(idGenerator.getAndIncrement());
            cartItems.add(cartItem);
        } else {
            cartItems.removeIf(item -> item.getId().equals(cartItem.getId()));
            cartItems.add(cartItem);
        }
        return cartItem;
    }

    @Override
    public void deleteById(Long id) {
        cartItems.removeIf(item -> item.getId().equals(id));
    }
}