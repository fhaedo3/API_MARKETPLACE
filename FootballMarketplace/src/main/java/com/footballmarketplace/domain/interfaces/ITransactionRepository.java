package com.footballmarketplace.domain.interfaces;

import com.footballmarketplace.domain.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ITransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBuyerId(Long buyerId);

    List<Transaction> findBySellerId(Long sellerId);

    List<Transaction> findByPlayerId(Long playerId);
}
