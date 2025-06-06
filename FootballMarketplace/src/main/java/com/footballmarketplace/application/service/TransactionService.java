package com.footballmarketplace.application.service;

import com.footballmarketplace.domain.interfaces.ITransactionRepository;
import com.footballmarketplace.domain.model.Operation;
import com.footballmarketplace.domain.model.Player;
import com.footballmarketplace.domain.model.Transaction;
import com.footballmarketplace.domain.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final ITransactionRepository transactionRepository;
    private final UserService userService;
    private final PlayerService playerService;
    private final OperationService operationService;

    public TransactionService(
            ITransactionRepository transactionRepository,
            UserService userService,
            PlayerService playerService,
            OperationService operationService) {
        this.transactionRepository = transactionRepository;
        this.userService = userService;
        this.playerService = playerService;
        this.operationService = operationService;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new IllegalArgumentException("Transacción no encontrada con ID: " + id);
        }
        return transactionRepository.findById(id);
    }

    public Transaction addTransaction(Transaction transaction) {
        if (transaction == null) {
            throw new IllegalArgumentException("La transacción no puede ser nula.");
        }
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new IllegalArgumentException("Transacción no encontrada con ID: " + id);
        }
        transactionRepository.deleteById(id);
    }

    public Transaction createTransaction(Long buyerId, Long sellerId, Long playerId, Double total) {
        User buyer = userService.getUserById(buyerId);
        User seller = userService.getUserById(sellerId);
        Player player = playerService.getPlayerById(playerId)
            .orElseThrow(() -> new IllegalArgumentException("Jugador no encontrado con ID: " + playerId));
        if (total == null || total <= 0) {
            throw new IllegalArgumentException("El total debe ser mayor a 0.");
        }

        Operation operation = new Operation();
        operation.setDescription("Player transfer from " + seller.getUsername() + " to " + buyer.getUsername());
        operation.setTimestamp(LocalDateTime.now());
        Operation savedOperation = operationService.addOperation(operation);


        Transaction transaction = new Transaction();
        transaction.setBuyer(buyer);
        transaction.setSeller(seller);
        transaction.setPlayer(player);
        transaction.setOperation(savedOperation);
        transaction.setDate(LocalDateTime.now());
        transaction.setTotal(total);


        player.setOwner(buyer);
        player.setIsForSale(false);
        playerService.addPlayer(player);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByBuyerId(Long buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    public List<Transaction> getTransactionsBySellerId(Long sellerId) {
        return transactionRepository.findBySellerId(sellerId); 
    }

    public List<Transaction> getTransactionsByPlayerId(Long playerId) {
        return transactionRepository.findByPlayerId(playerId);
    }
}