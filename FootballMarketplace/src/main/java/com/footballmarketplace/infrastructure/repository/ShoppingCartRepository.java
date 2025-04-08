package com.footballmarketplace.infrastructure.repository;

import com.footballmarketplace.domain.interfaces.IShoppingCartRepository;
import com.footballmarketplace.domain.model.ShoppingCart;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class ShoppingCartRepository implements IShoppingCartRepository {

    private final List<ShoppingCart> shoppingCarts = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public List<ShoppingCart> findAll() {
        return new ArrayList<>(shoppingCarts);
    }

    @Override
    public Optional<ShoppingCart> findById(Long id) {
        return shoppingCarts.stream().filter(cart -> cart.getId().equals(id)).findFirst();
    }

    @Override
    public ShoppingCart save(ShoppingCart shoppingCart) {
        if (shoppingCart.getId() == null) {
            shoppingCart.setId(idGenerator.getAndIncrement());
            shoppingCarts.add(shoppingCart);
        } else {
            shoppingCarts.removeIf(cart -> cart.getId().equals(shoppingCart.getId()));
            shoppingCarts.add(shoppingCart);
        }
        return shoppingCart;
    }

    @Override
    public void deleteById(Long id) {
        shoppingCarts.removeIf(cart -> cart.getId().equals(id));
    }
}