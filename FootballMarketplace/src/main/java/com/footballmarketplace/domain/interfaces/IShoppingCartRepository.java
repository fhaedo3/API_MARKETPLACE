package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findByUserId(Long userId);

    Optional<ShoppingCart> findByUserIdAndStatus(Long userId, String status);
}
