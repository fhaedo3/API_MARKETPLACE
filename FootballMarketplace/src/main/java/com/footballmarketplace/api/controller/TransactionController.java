package com.footballmarketplace.api.controller;

import com.footballmarketplace.application.dto.request.TransactionRequest;
import com.footballmarketplace.application.dto.response.TransactionResponse;
import com.footballmarketplace.application.service.*;
import com.footballmarketplace.domain.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

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
    public ResponseEntity<List<TransactionResponse>> listTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        List<TransactionResponse> response = transactions.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long transactionId) {
        return transactionService.getTransactionById(transactionId)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByBuyerId(@PathVariable Long buyerId) {
        List<Transaction> transactions = transactionService.getTransactionsByBuyerId(buyerId);
        List<TransactionResponse> response = transactions.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsBySellerId(@PathVariable Long sellerId) {
        List<Transaction> transactions = transactionService.getTransactionsBySellerId(sellerId);
        List<TransactionResponse> response = transactions.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByPlayerId(@PathVariable Long playerId) {
        List<Transaction> transactions = transactionService.getTransactionsByPlayerId(playerId);
        List<TransactionResponse> response = transactions.stream().map(this::toResponse).toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> addTransaction(@RequestBody TransactionRequest request) {
        User buyer = userService.getUserById(request.getBuyerId());
        User seller = userService.getUserById(request.getSellerId());
        Player player = playerService.getPlayerById(request.getPlayerId()).orElseThrow(() ->
            new IllegalArgumentException("Player not found with ID: " + request.getPlayerId()));
        Operation operation = operationService.getOperationById(request.getOperationId()).orElseThrow(() ->
            new IllegalArgumentException("Operation not found with ID: " + request.getOperationId()));

        Transaction transaction = new Transaction();
        transaction.setBuyer(buyer);
        transaction.setSeller(seller);
        transaction.setPlayer(player);
        transaction.setOperation(operation);
        transaction.setDate(java.time.LocalDateTime.now());
        transaction.setTotal(request.getTotal());

        Transaction savedTransaction = transactionService.addTransaction(transaction);
        TransactionResponse response = toResponse(savedTransaction);
        return ResponseEntity.created(URI.create("/transactions/" + savedTransaction.getId())).body(response);
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

    private TransactionResponse toResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setBuyerId(transaction.getBuyer() != null ? transaction.getBuyer().getId() : null);
        response.setSellerId(transaction.getSeller() != null ? transaction.getSeller().getId() : null);
        response.setPlayerId(transaction.getPlayer() != null ? transaction.getPlayer().getId() : null);
        response.setOperationId(transaction.getOperation() != null ? transaction.getOperation().getId() : null);
        response.setTotal(transaction.getTotal());
        response.setTimestamp(transaction.getDate() != null ? transaction.getDate().toString() : null);
        return response;
    }
}