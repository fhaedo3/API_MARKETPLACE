package main.java.com.footballmarketplace.infrastructure.repository;

import main.java.com.footballmarketplace.domain.interfaces.ITransactionRepository;
import main.java.com.footballmarketplace.domain.model.Transaction;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class TransactionRepository implements ITransactionRepository {

    private final List<Transaction> transactions = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public List<Transaction> findAll() {
        return new ArrayList<>(transactions);
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return transactions.stream().filter(tx -> tx.getId().equals(id)).findFirst();
    }

    @Override
    public Transaction save(Transaction transaction) {
        if (transaction.getId() == null) {
            transaction.setId(idGenerator.getAndIncrement());
            transaction.setDate(LocalDateTime.now());
            transactions.add(transaction);
        } else {
            transactions.removeIf(tx -> tx.getId().equals(transaction.getId()));
            transactions.add(transaction);
        }
        return transaction;
    }

    @Override
    public void deleteById(Long id) {
        transactions.removeIf(tx -> tx.getId().equals(id));
    }
}