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
        return transactionRepository.findById(id);
    }

    public Transaction addTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    public Transaction createTransaction(Long buyerId, Long sellerId, Long playerId, Double total) {
        User buyer = userService.getUserById(buyerId).orElse(null);
        User seller = userService.getUserById(sellerId).orElse(null);
        Player player = playerService.getPlayerById(playerId).orElse(null);

        if (buyer != null && seller != null && player != null) {
            // Crear operación
            Operation operation = new Operation();
            operation.setDescription("Player transfer from " + seller.getUsername() + " to " + buyer.getUsername());
            operation.setTimestamp(LocalDateTime.now());
            Operation savedOperation = operationService.addOperation(operation);

            // Crear transacción
            Transaction transaction = new Transaction();
            transaction.setBuyer(buyer);
            transaction.setSeller(seller);
            transaction.setPlayer(player);
            transaction.setOperation(savedOperation);
            transaction.setDate(LocalDateTime.now());
            transaction.setTotal(total);

            // Cambiar propietario del jugador
            player.setOwner(buyer);
            player.setIsForSale(false);
            playerService.addPlayer(player);

            return transactionRepository.save(transaction);
        }
        return null;
    }

    public List<Transaction> getTransactionsByBuyerId(Long buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    public List<Transaction> getTransactionsBySellerId(Long sellerId) {
        return transactionRepository.findBySellerId(sellerId); // Fixed method name
    }

    public List<Transaction> getTransactionsByPlayerId(Long playerId) {
        return transactionRepository.findByPlayerId(playerId);
    }
}