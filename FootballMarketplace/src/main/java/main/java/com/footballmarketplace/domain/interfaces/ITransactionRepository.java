package main.java.com.footballmarketplace.domain.interfaces;

import main.java.com.footballmarketplace.domain.model.Transaction;

import java.util.List;
import java.util.Optional;

public interface ITransactionRepository {
    List<Transaction> findAll();
    Optional<Transaction> findById(Long id);
    Transaction save(Transaction transaction);
    void deleteById(Long id);
}