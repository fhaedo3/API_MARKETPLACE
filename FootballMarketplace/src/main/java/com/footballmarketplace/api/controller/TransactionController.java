package com.footballmarketplace.api.controller;

import com.footballmarketplace.application.dto.TransactionRequest;
import com.footballmarketplace.application.service.*;
import com.footballmarketplace.domain.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @Autowired
    private PlayerService playerService;

    @Autowired
    private OperationService operationService;

    @GetMapping
    public ResponseEntity<List<Transaction>> listTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId) {
        return transactionService.getTransactionById(transactionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<Transaction>> getTransactionsByBuyerId(@PathVariable Long buyerId) {
        List<Transaction> transactions = transactionService.getTransactionsByBuyerId(buyerId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Transaction>> getTransactionsBySellerId(@PathVariable Long sellerId) {
        List<Transaction> transactions = transactionService.getTransactionsBySellerId(sellerId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<Transaction>> getTransactionsByPlayerId(@PathVariable Long playerId) {
        List<Transaction> transactions = transactionService.getTransactionsByPlayerId(playerId);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody TransactionRequest request) {
        Optional<User> buyerOpt = userService.getUserById(request.getBuyerId());
        Optional<User> sellerOpt = userService.getUserById(request.getSellerId());
        Optional<Player> playerOpt = playerService.getPlayerById(request.getPlayerId());
        Optional<Operation> operationOpt = operationService.getOperationById(request.getOperationId());

        if (buyerOpt.isEmpty() || sellerOpt.isEmpty() || playerOpt.isEmpty() || operationOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Transaction transaction = new Transaction();
        transaction.setBuyer(buyerOpt.get());
        transaction.setSeller(sellerOpt.get());
        transaction.setPlayer(playerOpt.get());
        transaction.setOperation(operationOpt.get());
        transaction.setDate(LocalDateTime.now());
        transaction.setTotal(request.getTotal());

        Transaction savedTransaction = transactionService.addTransaction(transaction);
        return ResponseEntity.created(URI.create("/transactions/" + savedTransaction.getId())).body(savedTransaction);
    }

    @PostMapping("/create-transfer")
    public ResponseEntity<Transaction> createTransfer(
            @RequestParam Long buyerId,
            @RequestParam Long sellerId,
            @RequestParam Long playerId,
            @RequestParam Double total) {

        Transaction transaction = transactionService.createTransaction(buyerId, sellerId, playerId, total);
        if (transaction != null) {
            return ResponseEntity.created(URI.create("/transactions/" + transaction.getId())).body(transaction);
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long transactionId) {
        transactionService.deleteTransaction(transactionId);
        return ResponseEntity.noContent().build();
    }
}