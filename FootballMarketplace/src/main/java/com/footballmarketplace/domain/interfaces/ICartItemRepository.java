package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ICartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);

    CartItem findByCartIdAndPlayerId(Long cartId, Long playerId);
}
